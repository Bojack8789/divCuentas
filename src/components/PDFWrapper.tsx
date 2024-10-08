import React, { useRef, useState } from 'react';
import { View, Button, Platform, StyleSheet, Alert } from 'react-native';
import { toPng } from 'html-to-image';

// Importaciones condicionales para evitar errores en web
let ViewShot, Share, RNFetchBlob;
if (Platform.OS !== 'web') {
  ViewShot = require('react-native-view-shot').default;
  Share = require('react-native-share').default;
  RNFetchBlob = require('rn-fetch-blob').default;
}

const PDFWrapper = ({ children }) => {
  const contentRef = useRef();
  const [isCapturing, setIsCapturing] = useState(false);

  const captureContent = async () => {
    setIsCapturing(true);
    try {
      if (Platform.OS === 'web') {
        const element = contentRef.current;
        return await toPng(element, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#FFFFFF'
        });
      } else {
        return await ViewShot.captureRef(contentRef, {
          format: 'png',
          quality: 1,
          result: 'data-uri'
        });
      }
    } catch (error) {
      console.error('Error al capturar contenido:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async () => {
    const uri = await captureContent();
    if (uri) {
      if (Platform.OS === 'web') {
        // Crear un blob y un objeto URL para la imagen
        const blob = await fetch(uri).then(r => r.blob());
        const blobUrl = URL.createObjectURL(blob);
        
        // Intentar usar la API Web Share si está disponible
        if (navigator.share) {
          try {
            await navigator.share({
              files: [new File([blob], 'captura.png', { type: 'image/png' })],
              title: 'Compartir imagen',
              text: 'Mira esta imagen que quiero compartir contigo'
            });
          } catch (error) {
            console.error('Error al compartir:', error);
            fallbackShare(blobUrl);
          }
        } else {
          fallbackShare(blobUrl);
        }
      } else {
        // Usar react-native-share para compartir en móvil
        Share.open({
          url: uri,
          type: 'image/png'
        }).catch(error => console.error('Error al compartir:', error));
      }
    }
  };

  const fallbackShare = (url) => {
    // Crear elementos para compartir manualmente
    const textarea = document.createElement('textarea');
    textarea.textContent = url;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      Alert.alert('Enlace copiado', 'El enlace de la imagen ha sido copiado al portapapeles. Puedes pegarlo en WhatsApp o cualquier otra aplicación para compartirlo.');
    } catch (error) {
      console.error('Error al copiar el enlace:', error);
      Alert.alert('Error', 'No se pudo copiar el enlace. Por favor, intenta nuevamente.');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleDownload = async () => {
    const uri = await captureContent();
    if (uri) {
      if (Platform.OS === 'web') {
        // Descargar la imagen en web
        const link = document.createElement('a');
        link.href = uri;
        link.download = 'captura.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Descarga completada', 'La imagen se ha descargado en tu dispositivo.');
      } else {
        // Guardar la imagen en el dispositivo móvil
        const downloadDir = RNFetchBlob.fs.dirs.PictureDir;
        const destPath = `${downloadDir}/captura_${Date.now()}.png`;
        
        RNFetchBlob.fs.writeFile(destPath, uri.split(',')[1], 'base64')
          .then(() => Alert.alert('Descarga completada', 'La imagen se ha guardado en tu galería.'))
          .catch(error => console.error('Error al descargar:', error));
      }
    }
  };

  const ContentWrapper = Platform.OS === 'web' ? 'div' : View;

  return (
    <View style={styles.container}>
      <ContentWrapper ref={contentRef} style={styles.content}>
        {children}
      </ContentWrapper>
      <View style={styles.buttonContainer}>
        <Button title="Compartir" onPress={handleShare} disabled={isCapturing} />
        <Button title="Descargar" onPress={handleDownload} disabled={isCapturing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default PDFWrapper;