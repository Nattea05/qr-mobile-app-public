import { Text, View, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Close } from '../../../../../../assets/svg_logos/svg_logos';

function DisplayQr({ receivedQrData, onBack }) {
    const qrData = receivedQrData
    const qrDataString = JSON.stringify(qrData)

    return (
        <View className="flex-1 flex flex-col bg-petgreen">
            <View className="w-full h-fit">
                <Pressable onPress={() => onBack()} className="ml-5 mt-10 flex flex-col w-14 h-14 justify-center items-center rounded-full bg-white">
                    <Close width={"36"} height={"36"} />
                </Pressable>
            </View>
            <View className="flex w-full h-2/3 justify-center items-center">
                <View className="flex w-72 h-72 justify-center items-center rounded-2xl bg-white">
                    <QRCode
                        value={qrDataString}
                        logo={require('../../../../../../assets/icon.png')}
                        size={200}
                    />
                </View>
            </View>
        </View>
    )
}

export default function Qr({ onReceiveQrData, receiveBack }) {
    function handleBack() {
        receiveBack()
    }

    return (
        <DisplayQr receivedQrData={onReceiveQrData} onBack={() => handleBack()} />
    )
}