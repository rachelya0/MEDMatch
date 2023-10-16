// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
import { Button, Checkbox, Dropdown, Form, Input, Menu, Space } from 'antd';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { areas, racial_identities, sources } from '../constants.js'


// const inter = Inter({ subsets: ['latin'] })

//if same_gender and same_race are true then check if race and gender are blank  
const fieldList = [
  // [labelname, dataname, isRequired, fieldType, options]
  ["Your name", "Name", true, "input", []],
  ["Your email", "Email", true, "input", []],
  ["Your phone number", "Phone_number", true, "input", []],
  ["Please type out the full name of your high school (i.e. Lindbolm " + 
  "Math and Science Academy)!", "High_school", true, "input", []],
  ["Location of High School (city)", "Location_of_high_school_city", true, "input", []],
  ["Location of High School (state)", "Location_of_high_school_state", true, "input", []],
  ["Your year in High School", "Year_in_high_school", true, "dropdown", ["Freshman", "Sophomore", "Junior", "Senior", "Other"]], //dropdown
  ["What gender do you identify as?", "Gender", false, "dropdown", ["Female", "Male", "Nonbinary", "Prefer not to say"]], //dropdown
  ["Would you prefer someone with the same gender identity as you? Please note we will try our best" + 
  " to match you with someone of your preference but we cannot guarantee it." , 
  "Same_gender", true, "dropdown", ["Yes", "No preference"]], //dropdown
  ["Your racial identity", "Race", false, "dropdown", racial_identities], //dropdown
  ["Would you prefer someone with the same racial/ethnic identity as you? Please note we will try our best" + 
  " to match you with someone of your preference but we cannot guarantee it." , "Same_race", true, "dropdown", ["Yes", "No preference"]], // dropdown
  ["Are there other identities you find important for you to share with your mentee? " + 
  "If so, please list them below.", "Other_identities", false, "input", []],
  ["What would you hope to gain out of this mentorship? In other words, how " +
  "do you think we can help you most?", "Areas_want_to_be_tutored_in", true, "dropdown", areas],// dropdown
  ["What are some of your career interests and goals in healthcare?\nPlease list your career interests " +
  "and goals as keywords with commas between each one: [Interest 1], [Interest 2], etc.\n " +
  "Examples of career interests and goals include health equity, women's health, research, etc.", "Career_goals_in_health_care", true, "input", []], 
  ["What are some of your hobbies and interests outside of medicine/healthcare? \nPlease list your keywords with commas between each one: " + 
  "[Interest 1], [Interest 2], etc.\n Examples of interests outside of medicine/healthcare include sports, music, dance, etc.", "Hobbies", true, "input", []],
  ["Please enter information about your schedule that will help us match you with the best tutor! Information includes ideal number of times/hours " + 
  "you would like to meet per week, what days/times you are available, whether you prefer in-person and/or virtual mentorship, etc.", "When_are_you_available", true, "input", []],
  ["If you were an ice cream flavor, what ice cream flavor would you be and why?", "Ice_Cream", true, "input", []],
  ["How did you hear about us?", "How_did_you_hear_about_us", false, "dropdown", sources], //dropdown
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
  const [chosenSources, setChosenSources] = useState([]);

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
            style={{ width: '100%', textAlign: 'left' }}
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
    // if (fieldType == 'checkbox'){
    //   return(
    //     <Form.Item
    //       label={labelname}
    //       name={dataname}
    //       key = {dataname}
    //       form = {form}
    //       rules={[
    //         {
    //           required: isRequired,
    //           message: `Missing ${labelname}`,
    //         },
    //       ]}
    //     >
    //       <Checkbox
    //         placement="bottom"
    //         trigger={['click']}
    //         style={{ width: '100%', textAlign: 'left' }}
    //         onClick={handleVarious}
    //         checked={selectedLocationNames.includes("Various")}
    //       >
    //         Various
    //       </Checkbox>
    //     </Form.Item>
    //   );
    // }
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
  
    // Add more cases for different field types as needed
  };

  const onFinish = async (values) => {
      //post to database
        const response = await axios.post('https://mentor-production.up.railway.app/addMentee', {
            Name: values.Name, 
            Email: values.Email, 
            Phone_number: values.Phone_number, 
            High_school: values.High_school, 
            Location_of_high_school_city : values.Location_of_high_school_city, 
            Location_of_high_school_state : values.Location_of_high_school_state, 
            Year_in_high_school : chosenYear,
            Gender: chosenGender, 
            Same_gender: choseSameGender, 
            Same_race: choseSameRace, 
            Race: chosenRace, 
            Other_identities: values.Other_identities, 
            Areas_want_to_be_tutored_in: chosenAreas, 
            Career_goals_in_health_care: values.Career_goals_in_health_care, 
            Hobbies: values.Hobbies, 
            When_are_you_available : values.When_are_you_available, 
            Ice_Cream : values.Ice_Cream,
            How_did_you_hear_about_us : chosenSources,
            Anything_else : values.Anything_else
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
        case 'Year_in_high_school':
            return setChosenYear;
        case 'Gender':
            return setChosenGender;
        case 'Same_gender':
            return setChoseSameGender;
        case 'Race':
            return setChosenRace;
        case 'Same_race':
            return setChoseSameRace;
        case 'Areas_want_to_be_tutored_in':
            return setChosenAreas;
        case 'How_did_you_hear_about_us':
            return setChosenSources;
      default:
        return null;
    }
  };

  const getOptionStateFunction = (dataname) => {
    switch (dataname) {
        case 'Year_in_high_school':
            return chosenYear;
        case 'Gender':
            return chosenGender;
        case 'Same_gender':
            return choseSameGender;
        case 'Race':
            return chosenRace;
        case 'Same_race':
            return choseSameRace;
        case 'Areas_want_to_be_tutored_in':
            return chosenAreas;
        case 'How_did_you_hear_about_us':
            return chosenSources;
      default:
        return null;
    }
  };

//   const LocationSelector = () => {
//     useEffect(() => {
//       console.log("location names update", selectedLocationNames);
//     }, [selectedLocationNames]);
//     useEffect(() => {
//       console.log("location coords update", selectedLocationCoords);
//     }, [selectedLocationCoords]);
//     useEffect(() => {
//       console.log("name to coords dict update", locationNameToCoords);
//     }, [locationNameToCoords]);
//     // add location to list
//     function addLocation(newLocation) {
//       console.log("ADD LOCATION");
//       console.log(selectedLocationNames)
//       if (selectedLocationNames.length < 1){
//         // get data from newLocation
//         const locationData = newLocation.features[0].properties
//         // update name list
//         const newLocText = locationData.name + ', ' + locationData.place_formatted
//         setSelectedLocationNames([...selectedLocationNames, newLocText])
//         // update name to coords dict
//         let tmp = locationNameToCoords;
//         tmp[newLocText] = locationData.coordinates;
//         setLocationNameToCoords(tmp)
//         // update location coords list
//         setSelectedLocationCoords([...selectedLocationCoords, [locationData.coordinates.latitude, locationData.coordinates.longitude]])
//       }
//       else{
//         setSelectedLocationNames(["Various"]);
//         setSelectedLocationCoords([[null, null]]);
//         setLocationNameToCoords({"Various": {latitude: null, longitude: null}});
//       }
      
//     };
    // function onChangeCheck(checkedValues) {
    //   console.log("ON CHANGE CHECK")
    //   // determine new list of coords and dict
    //   let tmpMap = {}
    //   let tmpCoords = []
    //   // if (checkedValues.length <= 1){
    //     checkedValues.map((locText) => {
    //       tmpMap[locText] = locationNameToCoords[locText];
    //       tmpCoords = [...tmpCoords, [locationNameToCoords[locText].latitude, locationNameToCoords[locText].longitude]];
    //     });
    //     setSelectedLocationNames(checkedValues);
    //   // }
    //   // else{
    //   //   setSelectedLocationNames(["Various"]);
    //   // }
    //   setLocationNameToCoords(tmpMap);
    //   setSelectedLocationCoords(tmpCoords);
      
    // };
//     const LocationList = () => {
//       // console.log("LOCATION LIST RENDER")
//       return (
//         <Checkbox.Group style={{ marginTop: '10px', marginBottom: '10px', fontSize: '0.9em' }} options={selectedLocationNames} defaultValue={selectedLocationNames} onChange={onChangeCheck} />
//       );
//     };

//     return (
//       <div>
//         Location of program
//         <MySearchBox onRetrieve={addLocation}/>
//         <LocationList />
//       </div>
//     );
//   };
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
                Mentee Preference Form
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
