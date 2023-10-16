import React, { useContext, useEffect } from 'react';
import { Row, Col, Image } from "antd";
// import styled from "styled-components";
import { useRouter } from "next/router";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

// const StyledButton = styled.button`
//   color: white;
//   font-size: 1rem;
//   font-family: Avenir-Light;
//   border-radius: 30px;
//   border-color: transparent;
//   background: #ff9e6d;

//   &:hover {
//     color: white;
//     text-decoration: underline;
//     text-decoration-color: #0082a9;
//   }
// `;

// 768 is md
const Header = () => {

  return (
    <div>
      <Row
        align = "middle"
        style = {{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Col
          xl={{ span: 3, offset: 1 }}
          sm={{ span: 8, offset: 1 }}
          xs={{ span: 8, offset: 1 }}
        >
          <a href="/">
            <Image src="/logo.png" style={{ width: "100%" }} />
          </a>
        </Col>
    </Row>
    </div>
  );  
};

export default Header;

