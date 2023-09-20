import { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Animated, { Easing, SlideInDown, SlideOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker'

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function PetModal({ onModalClose, onReceiveImage }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const snapImage = async () => {
    if ((await ImagePicker.getCameraPermissionsAsync()).granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
    
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      ImagePicker.requestCameraPermissionsAsync()
    }
  }

  useEffect(() => {
    if (!modalVisible) {
      onModalClose()
    }
  }, [modalVisible])

  useEffect(() => {
    if (image) {
      onReceiveImage(image);
      setModalVisible(false)
    }
  }, [image])

  return (
    <Modal 
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
      <Pressable className="flex-1 z-10" onPress={() => setModalVisible(false)} />
      <Animated.View
        entering={SlideInDown.duration(200).easing(Easing.bezier(0.09, 0.38, 0.09, 1.01))}
        exiting={SlideOutDown.duration(250).easing(Easing.bezier(0.09, 0.38, 0.09, 1.01))}
        className="flex flex-col absolute bottom-0 w-full h-1/3 justify-evenly items-center rounded-t-2xl bg-white z-20"
      >
        <Pressable onPress={() => snapImage()} className="w-11/12 h-20 justify-center items-center bg-petgreen active:bg-activepetgreen rounded-2xl">
          <Text className="font-medium text-3xl">Use Camera</Text>
        </Pressable>
        <Pressable onPress={() => pickImage()} className="w-11/12 h-20 justify-center items-center bg-petgreen active:bg-activepetgreen rounded-2xl">
          <Text className="font-medium text-3xl">Pick from Gallery</Text>
        </Pressable>
      </Animated.View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}      
      >
        <AnimatedBlurView
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          className="flex-1 z-0"
          intensity={50}
          tint='dark'
        >
        </AnimatedBlurView>
      </Modal>
    </Modal>
  )
}