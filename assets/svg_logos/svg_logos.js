import { Svg, Path } from "react-native-svg"

export function Close({ width, height }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path fill="black" d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
        </Svg>
    )
}

export function Done({ width, height, fill }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path fill={fill} d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/>
        </Svg>
    )
}

export function VisibilityOn({ width, height }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path fill="black" d="M480.118-330Q551-330 600.5-379.618q49.5-49.617 49.5-120.5Q650-571 600.382-620.5q-49.617-49.5-120.5-49.5Q409-670 359.5-620.382q-49.5 49.617-49.5 120.5Q310-429 359.618-379.5q49.617 49.5 120.5 49.5Zm-.353-58Q433-388 400.5-420.735q-32.5-32.736-32.5-79.5Q368-547 400.735-579.5q32.736-32.5 79.5-32.5Q527-612 559.5-579.265q32.5 32.736 32.5 79.5Q592-453 559.265-420.5q-32.736 32.5-79.5 32.5ZM480-200q-146 0-264-83T40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83Z"/>
        </Svg>
    )
}

export function VisibilityOff({ width, height }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path fill="black" d="M816-64 648-229q-35 14-79 21.5t-89 7.5q-146 0-265-81.5T40-500q20-52 55.5-101.5T182-696L56-822l42-43 757 757-39 44ZM480-330q14 0 30-2.5t27-7.5L320-557q-5 12-7.5 27t-2.5 30q0 72 50 121t120 49Zm278 40L629-419q10-16 15.5-37.5T650-500q0-71-49.5-120.5T480-670q-22 0-43 5t-38 16L289-760q35-16 89.5-28T485-800q143 0 261.5 81.5T920-500q-26 64-67 117t-95 93ZM585-463 443-605q29-11 60-4.5t54 28.5q23 23 32 51.5t-4 66.5Z"/>
        </Svg>
    )
}