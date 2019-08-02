import React, { Component } from 'react';
import { View, Button, Image, TouchableWithoutFeedback, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';

import styles from '../styles/BodyQuestionFileStyle';
import { COLOR_PALETTE } from '../../../config/theme';

const imagePickerOptions = {
    title: 'Envoyer une image',
    storageOptions: {
        skipBackup: true,
        path: 'd4images'
    },
    mediaType: 'image',
    takePhotoButtonTitle: 'Prendre une photo',
    chooseFromLibraryButtonTitle: 'Importer une image depuis la galerie',
    cancelButtonTitle: 'Annuler',
};

const videoPickerOptions = {
    title: 'Envoyer une vidéo',
    storageOptions: {
        skipBackup: true,
        path: 'd4videos'
    },
    mediaType: 'video',
    videoQuality: 'low',
    takePhotoButtonTitle: 'Prendre une video',
    chooseFromLibraryButtonTitle: 'Importer une video depuis la galerie',
    cancelButtonTitle: 'Annuler',
};

class BodyQuestionFile extends Component {
    constructor(props){
        super(props);

        this.state = {
            image: {
                data: '',
                uri: '',
                path: '',
            },
            video: {
                uri: '',
                path: '',
                rate: 1,
            },
            answer: [``, ``],            
        };
    }

    showMediaPicker = (fileType) => {
        let options = null;
        if (fileType === 'image'){
            options = imagePickerOptions;
        }
        else if (fileType === 'video'){
            options = videoPickerOptions;
        }
        else {
            return;
        }

        ImagePicker.showImagePicker(options, (response) => {
            if(!response.didCancel && !response.error && !response.customButton){
                if(response.path === null || response.path === ''){
                    this.props.showToast('Impossible de trouver le fichier');
                    return;
                }
                let answer = this.state.answer.slice();
                let filename = response.path;
                filename = filename.split('/').pop();
                answer[0] = filename;
                if (fileType === 'video'){
                    this.setState({
                        video: {
                            uri: response.uri,
                            path: response.path,
                        },
                        image: {
                            data: '',
                            uri: '',
                            path: '',
                        },
                        answer: answer,
                    }, () => this.props.changeFile(
                        this.props.id,
                        this.state.video.path.split('/').pop(),
                        'video',
                        this.state.video.path.split('.').pop(),
                        this.state.video.path
                    ));
                } 
                else if (fileType === 'image'){
                    this.setState({
                        image: {
                            data: response.data,
                            uri: response.uri,
                            path: response.path,
                        },
                        video: {
                            uri: '',
                            path: '',
                        },
                        answer: answer,
                    }, () => this.props.changeFile(
                        this.props.id,
                        this.state.image.path.split('/').pop(),
                        'image',
                        this.state.image.path.split('.').pop(),
                        this.state.image.path
                    ));
                }
            }
        });
    };

    onChange = (event) => {
        let answer = this.state.answer.slice();
        answer[1] = event.nativeEvent.text;
        this.setState({
            answer: answer,
        }, () => this.props.changeAnswer(this.props.id, this.state.answer));
    };

    render(){
        let picker = [];
        if(this.props.fileTypes[0]){
            picker.push(
                <Button
                    key={0}
                    onPress={() => this.showMediaPicker('image')}
                    title={'Ajouter une image'}
                    color={COLOR_PALETTE.primaryColor.P500}
                />
            );
        }
        if(this.props.fileTypes[1]){
            picker.push(
                <Button
                    key={1}
                    onPress={() => this.showMediaPicker('video')}
                    title={'Ajouter une vidéo'}
                    color={COLOR_PALETTE.primaryColor.P500}
                />
            );
        }

        let commentary = null;
        if(this.props.commentary){
            commentary = (
                <TextInput
                    placeholder={'Commentez le fichier...'}
                    onEndEditing={(e) => this.onChange(e)}
                    multiline={true}
                    style={styles.commentary}
                />
            );
        }

        return (
            <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                    {picker}
                </View>
                {this.state.image.uri === '' ? null:
                    <Image 
                        source={{uri: `data:image/${this.state.image.path.split('/').pop()};base64,${this.state.image.data}`}}
                        resizeMode={'contain'}
                        style={styles.image}
                    />
                }
                {this.state.video.uri === '' ? null:
                    <TouchableWithoutFeedback
                        onPress={() => this.setState((prevState) => ({video: {rate: Number(!prevState.video.rate)}}))}
                    >
                        <Video
                            source={{uri: this.state.video.path}}
                            style={styles.video}
                            resizeMode={'contain'}
                            rate={this.state.video.rate}
                            volume={1}
                            repeat={true}
                        />
                    </TouchableWithoutFeedback>
                }
                {commentary}
            </View>
        );
    }

} export default BodyQuestionFile;