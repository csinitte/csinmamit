import styled, { keyframes } from "styled-components";

const hue = keyframes`
  from {
    filter: hue-rotate(200deg); /* Dark Blue */
  }
  to {
    filter: hue-rotate(320deg); /* Light Blue */
  }
`;

const AnimatedGradientText = styled.h1`
  color: #8a2be2; /* Dark Blue */
  background-image: -webkit-linear-gradient(
    92deg,
    #8a2be2,
    #4682b4
  ); /* Dark Blue to Light Blue */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${hue} 10s infinite linear;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-feature-settings: "kern";
  font-size: 48px;
  font-weight: 700;
  line-height: 48px;
  overflow-wrap: break-word;
  text-align: center;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
`;

export const AnimatedGradientTexth2 = styled.h5`
  color: #8a2be2; /* Dark Blue */
  background-image: -webkit-linear-gradient(
    92deg,
    #8a2be2,
    #4682b4
  ); /* Dark Blue to Light Blue */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${hue} 10s infinite linear;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-feature-settings: "kern";
  font-size: 30px;
  font-weight: 700;
  line-height: 48px;
  overflow-wrap: break-word;
  text-align: center;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
`;

export const AnimatedGradientTexth3 = styled.h5`
  color: #8a2be2; /* Dark Blue */
  background-image: -webkit-linear-gradient(
    92deg,
    #8a2be2,
    #4682b4
  ); /* Dark Blue to Light Blue */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${hue} 10s infinite linear;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-feature-settings: "kern";
  font-size: 20px;
  font-weight: 700;
  line-height: 48px;
  overflow-wrap: break-word;
  text-align: center;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
`;

export default AnimatedGradientText;
