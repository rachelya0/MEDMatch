// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
import { Button, Checkbox, Dropdown, Form, Input, Menu, Space } from 'antd';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import axios from "axios";
import { areas, racial_identities } from '../constants.js'


// const inter = Inter({ subsets: ['latin'] })

//if same_gender and same_race are true then check if race and gender are blank  
const fieldList = [
  // [labelname, dataname, isRequired, fieldType, options]
  ["Your name", "Name", true, "input", []],
  ["Your email", "Email", true, "input", []],
  ["Your phone number", "Phone_number", true, "input", []],
  ["Your year", "Year", true, "dropdown", ["Freshman", "Sophomore", "Junior", "Senior", "Other"]], //dropdown
  ["What gender do you identify as?", "Gender", false, "dropdown", ["Female", "Male", "Nonbinary", "Prefer not to say"]], //dropdown
  ["Would you prefer someone with the same gender identity as you? Please note we will try our best" + 
  " to match you with someone of your preference but we cannot guarantee it." , 
  "Same_gender", true, "dropdown", ["Yes", "No preference"]], //dropdown
  ["Your racial identity", "Race", false, "dropdown", racial_identities], //dropdown
  ["Would you prefer someone with the same racial/ethnic identity as you? Please note we will try our best" + 
  " to match you with someone of your preference but we cannot guarantee it." , "Same_race", true, "dropdown", ["Yes", "No preference"]], // dropdown
  ["Are there other identities you find important for you to share with your mentee? " + 
  "If so, please list them below.", "Other_identities", false, "input", []],
  ["What areas would you like to mentor?", "Areas_want_to_tutor_in", true, "dropdown", areas],// dropdown
  ["What are some of your career interests and goals in healthcare?\nPlease list your career interests " +
  "and goals as keywords with commas between each one: [Interest 1], [Interest 2], etc.\n " +
  "Examples of career interests and goals include health equity, women's health, research, etc.", "Career_interests_in_medicine", true, "input", []], 
  ["How many mentees would you like to take on?", "How_many_mentees", true, "input", []],
  ["What are some of your hobbies and interests outside of medicine/healthcare? \nPlease list your keywords with commas between each one: " + 
  "[Interest 1], [Interest 2], etc.\n Examples of interests outside of medicine/healthcare include sports, music, dance, etc.", "Hobbies", true, "input", []],
  ["If you were an ice cream flavor, what ice cream flavor would you be and why?", "Ice_cream_flavor", true, "input", []],
  ["Anything else you'd like us to know?", "Anything_else", true, "input", []],
]

const Mentor = () => {
  const [form] = Form.useForm();

  const [chosenYear, setChosenYear] = useState("N/A");
  const [chosenGender, setChosenGender] = useState("N/A");
  const [choseSameGender, setChoseSameGender] = useState("N/A");
  const [chosenRace, setChosenRace] = useState("N/A");
  const [choseSameRace, setChoseSameRace] = useState("N/A");
  const [chosenAreas, setChosenAreas] = useState([]);

  const menu = (options, optionState, setOptionState) => {
    return (
      <Menu>
        {options.map((option) => (
          <Menu.Item key={option}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (Array.isArray(optionState)){
                    const noNullOptions = optionState.filter((item) => item !== "N/A")
                    const updatedOptions = noNullOptions.includes(option)
                    ? noNullOptions.filter((item) => item !== option)
                    : [...noNullOptions, option];
                    setOptionState(updatedOptions);
                }
                else{
                    console.log(optionState)
                    console.log(option)
                    if (option === 'Yes'){
                        setOptionState("true");
                    }
                    else if (option === 'No preference'){
                        setOptionState("false");
                    }
                    else{
                        setOptionState(option);
                    }
                }
                
              }}
              style={{
                border: 'none',
                outline: 'none',
                color: Array.isArray(optionState)? 
                    (optionState.includes(option) ? 'green' : '#00A4CA') :
                        (optionState === option || option === 'Yes' && optionState === "true" || option == 'No preference' && optionState === "false" ? 
                            'green' : '#00A4CA'),
                fontFamily: 'Avenir-Medium',
                borderRadius: '20px',
              }}
            >
              {option}
            </Button>
          </Menu.Item>
        ))}
      </Menu>
    );
  };
  
  const FormItem = (labelname, form, dataname, isRequired, fieldType, options) => {
    if (fieldType === 'dropdown') {
      console.log(dataname);
      return (
        <Form.Item
          label={labelname}
          name={dataname}
          key = {dataname}
          form = {form}
          initialValue="N/A"
          rules={[
            {
              required: isRequired,
              message: `Missing ${labelname}`,
            },
          ]}
        >
          <Dropdown
            overlay={menu(options, getOptionStateFunction(dataname), getSetOptionStateFunction(dataname))}
            placement="bottom"
            trigger={['click']}
            style={{ width: '100%', textAlign: 'left'}}
          >
             <a onClick={(e) => e.preventDefault()}>
              <Space>
                Choose an option
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Form.Item>
      );
    }
    return (
      <Form.Item
        label={labelname}
        name={dataname}
        key = {dataname}
        rules={[
          {
            required: isRequired,
            message: `Missing ${labelname}`,
          },
        ]}
      >
        {dataname === "Name" || dataname === "Email" || dataname === "Phone_number" ?
            <Input />
        :
            <Input.TextArea />
        }
      </Form.Item>
    );
  };

  const onFinish = async (values) => {
      //post to database
      const response = await axios.post('https://mentor-production.up.railway.app/addMentor', {
            Name: values.Name, 
            Email: values.Email, 
            Phone_number: values.Phone_number, 
            Year: chosenYear, 
            Gender: chosenGender, 
            Same_gender: choseSameGender, 
            Same_race: choseSameRace, 
            Race: chosenRace, 
            Other_identities: values.Other_identities, 
            Areas_want_to_tutor_in: chosenAreas, 
            Career_interests_in_medicine: values.Career_interests_in_medicine, 
            How_many_mentees: values.How_many_mentees,
            Hobbies: values.Hobbies, 
            Ice_cream_flavor: values.Ice_cream_flavor, 
            Anything_else: values.Anything_else
        });
      if (response && response.data) {
          // Redirect to the profile page after successful submission
          window.open("/", "_self");
      } else {
          console.error('Failed to submit data:', response.statusText);
      }
      console.log('Success:', values);

    }


  const onFinishFailed = (values, errorInfo) => {
    console.log(values);
  };

  // Define a function to return the appropriate setOptionState function based on dataname
  const getSetOptionStateFunction = (dataname) => {
    switch (dataname) {
        case 'Year':
            return setChosenYear;
        case 'Gender':
            return setChosenGender;
        case 'Same_gender':
            return setChoseSameGender;
        case 'Race':
            return setChosenRace;
        case 'Same_race':
            return setChoseSameRace;
        case 'Areas_want_to_tutor_in':
            return setChosenAreas;
      default:
        return null;
    }
  };

  const getOptionStateFunction = (dataname) => {
    switch (dataname) {
        case 'Year':
            return chosenYear;
        case 'Gender':
            return chosenGender;
        case 'Same_gender':
            return choseSameGender;
        case 'Race':
            return chosenRace;
        case 'Same_race':
            return choseSameRace;
        case 'Areas_want_to_tutor_in':
            return chosenAreas;
      default:
        return null;
    }
  };

  const FormItems = (form) => {
    return (
      fieldList.map((field) => { // Add the index parameter here
        if (field[3] === 'dropdown') {
          // Pass the corresponding setOptionState function to the dropdown fields
          return FormItem(field[0], form, field[1], field[2], field[3], field[4]);
        } else {
          return FormItem(field[0], form, field[1], field[2], field[3], undefined); // Pass index as key prop
        }
      })
    );
  };

  return (
    <div style={{ marginLeft: "30%" }}>
      {
        <div>
            <h1 style = {{fontFamily: 'Avenir-Medium'}}>
                Mentor Preference Form
            </h1>
            <Form
              form = {form}
              name="basic"
              labelCol={{ span: 100 }}
              wrapperCol={{ span: 100 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <FormItems />
              <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
      }
      
    </div>
  )
}

export default Mentor;
