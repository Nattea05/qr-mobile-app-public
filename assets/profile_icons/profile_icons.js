import { Svg, Path } from "react-native-svg"

export function ProfilePicture({ fill }) {
    return (
        <Svg width="200" height="200" viewBox="0 0 44 43" xmlns="http://www.w3.org/2000/svg">
            <Path d="M10.7079 31.0411C12.5572 29.7495 14.3918 28.7588 16.2117 28.069C18.0316 27.3792 19.9835 27.0343 22.0676 27.0343C24.1517 27.0343 26.111 27.3792 27.9456 28.069C29.7802 28.7588 31.6221 29.7495 33.4714 31.0411C34.7629 29.456 35.6802 27.8562 36.2232 26.2418C36.7663 24.6274 37.0378 22.9249 37.0378 21.1343C37.0378 16.8781 35.6068 13.319 32.7449 10.4571C29.8829 7.59516 26.3238 6.16419 22.0676 6.16419C17.8114 6.16419 14.2523 7.59516 11.3904 10.4571C8.52845 13.319 7.09748 16.8781 7.09748 21.1343C7.09748 22.9249 7.37634 24.6274 7.93405 26.2418C8.49176 27.8562 9.41639 29.456 10.7079 31.0411ZM22.0594 22.4552C20.3624 22.4552 18.9342 21.8728 17.7747 20.7079C16.6153 19.543 16.0355 18.112 16.0355 16.415C16.0355 14.7179 16.618 13.2897 17.7829 12.1302C18.9478 10.9708 20.3788 10.3911 22.0758 10.3911C23.7728 10.3911 25.2011 10.9735 26.3605 12.1384C27.52 13.3033 28.0997 14.7343 28.0997 16.4313C28.0997 18.1284 27.5173 19.5566 26.3524 20.7161C25.1874 21.8755 23.7565 22.4552 22.0594 22.4552ZM22.0882 38.7463C19.6675 38.7463 17.3858 38.284 15.243 37.3593C13.1002 36.4347 11.2289 35.1725 9.6292 33.5728C8.02944 31.973 6.76726 30.1052 5.84263 27.9693C4.918 25.8334 4.45569 23.5511 4.45569 21.1226C4.45569 18.6941 4.918 16.4158 5.84263 14.2877C6.76726 12.1596 8.02944 10.2957 9.6292 8.69591C11.2289 7.09616 13.0968 5.83397 15.2327 4.90934C17.3686 3.98471 19.6508 3.5224 22.0793 3.5224C24.5079 3.5224 26.7862 3.98471 28.9143 4.90934C31.0424 5.83397 32.9063 7.09616 34.5061 8.69591C36.1058 10.2957 37.368 12.1601 38.2926 14.2891C39.2173 16.4182 39.6796 18.693 39.6796 21.1137C39.6796 23.5344 39.2173 25.8162 38.2926 27.959C37.368 30.1018 36.1058 31.973 34.5061 33.5728C32.9063 35.1725 31.0419 36.4347 28.9129 37.3593C26.7838 38.284 24.5089 38.7463 22.0882 38.7463ZM22.0676 36.1045C23.6821 36.1045 25.2598 35.8697 26.8008 35.4C28.3419 34.9304 29.8609 34.1085 31.3579 32.9343C29.8609 31.8776 28.3345 31.0704 26.7788 30.5127C25.2231 29.955 23.6527 29.6761 22.0676 29.6761C20.4826 29.6761 18.9122 29.955 17.3564 30.5127C15.8007 31.0704 14.2743 31.8776 12.7773 32.9343C14.2743 34.1085 15.7934 34.9304 17.3344 35.4C18.8755 35.8697 20.4532 36.1045 22.0676 36.1045ZM22.0676 19.8134C23.0656 19.8134 23.8802 19.4979 24.5113 18.8668C25.1424 18.2357 25.4579 17.4212 25.4579 16.4231C25.4579 15.4251 25.1424 14.6106 24.5113 13.9795C23.8802 13.3484 23.0656 13.0328 22.0676 13.0328C21.0696 13.0328 20.2551 13.3484 19.624 13.9795C18.9929 14.6106 18.6773 15.4251 18.6773 16.4231C18.6773 17.4212 18.9929 18.2357 19.624 18.8668C20.2551 19.4979 21.0696 19.8134 22.0676 19.8134Z" fill={fill} />
        </Svg>
    )
}

export function EditProfile({ width, height, fill }) {
    return (
        <Svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <Path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" fill={fill} />
        </Svg>
    )
}