// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
import React, { useState, useEffect } from "react";
import { Row, Button } from 'antd';

// const inter = Inter({ subsets: ['latin'] })

// color: white;
// font-size: 1rem;
// font-family: Avenir-Light;
// border-radius: 30px;
// border-color: transparent;
// background: #ff9e6d;

const Home = () => (
  <>
    <h1 style = {{display:"flex", justifyContent:"center", fontFamily: 'Avenir-Medium'}}>
      Welcome to ProjectMED's mentor-mentee matching form! 
    </h1>
    <Row
      style = {{display: "flex", justifyContent: "center"}}
    >
        <Button
          onClick={(e) => {
            e.preventDefault();
            window.open("/mentor", "_self");
          }}
          style = {{fontFamily: 'Avenir-Medium', backgroundColor: '#ff9e6d', color: "white", borderRadius: "20px"}}
        >
          Mentor form
        </Button>

        <Button
          onClick={(e) => {
            e.preventDefault();
            window.open("/mentee", "_self");
          }}
          style = {{fontFamily: 'Avenir-Medium', backgroundColor: '#00A4CA', color: "white", borderRadius: "20px"}}
        >
          Mentee form
        </Button>
    </Row>
  </>
)
  


export default Home;