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

export function PhoneNumber({ width, height, fill }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960" >
            <Path d="M795-120q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19 13-32t32-13h140q14 0 24 10t14 25l27 126q2 14-.5 25.5T359-634L259-533q26 44 55 82t64 72q37 38 78 69.5t86 55.5l95-98q10-11 23-15t26-2l119 26q15 4 25 16t10 27v135q0 19-13 32t-32 13Z" fill={fill}/>
        </Svg>
    )
}

export function Email({ width, height, fill }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm340-302 340-223v-55L480-522 140-740v55l340 223Z" fill={fill}/>
        </Svg>
    )
}

export function Location({ width, height, fill }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path d="M480.089-490Q509-490 529.5-510.589q20.5-20.588 20.5-49.5Q550-589 529.411-609.5q-20.588-20.5-49.5-20.5Q451-630 430.5-609.411q-20.5 20.588-20.5 49.5Q410-531 430.589-510.5q20.588 20.5 49.5 20.5ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z" fill={fill}/>
        </Svg>
    )
}

export function Time({ width, height, fill }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path d="m627-287 45-45-159-160v-201h-60v225l174 181ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-82 31.5-155t86-127.5Q252-817 325-848.5T480-880q82 0 155 31.5t127.5 86Q817-708 848.5-635T880-480q0 82-31.5 155t-86 127.5Q708-143 635-111.5T480-80Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480-820q-140 0-240 100T140-480q0 140 100 240t240 100Z" fill={fill}/>
        </Svg>
    )
}

export function Back({ width, height, fill }) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 -960 960 960">
            <Path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" fill={fill}/>
        </Svg>        
    )
}