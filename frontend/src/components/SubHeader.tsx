import React from 'react';
import styled from 'styled-components';

const BoldSubHeader = styled.h2`
  font-weight: bold;
`;

const SubHeader = ({ text }) => {
  return <BoldSubHeader>{text}</BoldSubHeader>;
};

export default SubHeader;