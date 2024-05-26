import { Image, StyleSheet, Platform } from 'react-native'
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  FlashMode,
  CameraPictureOptions,
  CameraMountError
} from 'expo-camera'
import { useState, useRef } from 'react'
import { Button, Text, TouchableOpacity, View } from 'react-native'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { HelloWave } from '@/components/HelloWave'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { AssetRef } from 'expo-media-library'

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const [image, setImage] = useState<string | null>(null)
  const [flash, setFlash] = useState<FlashMode>('off')
  // @ts-ignore: just being lazy with types here
  const cameraRef = useRef<CameraView>(undefined)
  const [permissionResponse, requestPermissionResponse] =
    MediaLibrary.usePermissions()

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    )
  }

  if (!permissionResponse) {
    // Camera permissions are still loading.
    return <View />
  }
  if (!permissionResponse.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to get save file
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    )
  }

  const handleCameraReady = () => {
    // console.log('La cámara está lista y lista para tomar fotos.')
    // Aquí puedes agregar cualquier lógica adicional que necesites ejecutar
  }

  const handleCameraMountError = (error: CameraMountError) => {
    console.error('Error al montar la cámara:', error.message)
    // Aquí puedes agregar cualquier lógica adicional para manejar el error
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }
  function toggleFlash() {
    setFlash((current) => (current === 'on' ? 'off' : 'on'))
  }

  const takePicture = async () => {
    const newFileUri = FileSystem.documentDirectory + 'fotografia.jpg'
    if (cameraRef.current) {
      const options: CameraPictureOptions = {
        additionalExif: {
          make: 'YourApp',
          model: 'YourDeviceModel',
          datetime: new Date().toISOString()
        },
        base64: true,
        exif: true,
        quality: 0.8
      }

      try {
        const photo = await cameraRef.current.takePictureAsync(options)
        if (!photo?.uri) {
          throw new Error('No URI found for the photo')
        }
        FileSystem.copyAsync({
          from: photo.uri,
          to: newFileUri
        })
        setImage(photo.uri)
        try {
          MediaLibrary.saveToLibraryAsync(newFileUri)
          // const albumName = 'albumNuevo1'

          // let album = await MediaLibrary.getAlbumAsync(albumName)

          // if (!album) {
          //   try {
          //     album = await MediaLibrary.createAlbumAsync(albumName, newFileUri)
          //     console.log('Album created:', album)
          //     alert(`Album created: ${album}`)
          //   } catch (error) {
          //     console.error('Error creating album:', error)
          //     alert('An error occurred while creating the album.')
          //   }
          // } else {
          //   console.log('Album already exists:', album)
          //   alert(`Album already exists: ${album}`)
          // }
        } catch (error) {
          console.error('Error getting album:', error)
          alert('An error occurred while accessing the album.')
        }
      } catch (error) {
        console.error('Error al tomar la foto:', error)
      }
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          flash={flash}
          mode='picture'
          onCameraReady={handleCameraReady}
          onMountError={handleCameraMountError}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Girar cámara</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        <Button title={`Flash:${flash}`} onPress={toggleFlash} />
        <Button title='Take Picture' onPress={takePicture} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute'
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20
  }
})
