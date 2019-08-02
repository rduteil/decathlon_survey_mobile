import React, { Component } from 'react';
import { View, Image, Text, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';

import FuckinCheckbox from '../../../../imports/components/FuckinCheckbox';
import FuckinRadioButton from '../../../../imports/components/FuckinRadioButton';
import styles from '../../../../imports/styles/ModalStyle';

class ChoiceDialog extends Component {
    createButton = (line, column) => {
        if(this.props.numberOfAnswers === 1){
            return(
                <FuckinRadioButton
                    checked={this.props.checked[line][column]}
                    line={line}
                    column={column}
                    onChange={this.props.onChange}
                />
            );
        }
        else {
            return(
                <FuckinCheckbox
                    checked={this.props.checked[line][column]}
                    line={line}
                    column={column}
                    onChange={this.props.onChange}
                />
            );
        }
    };

    render(){
        let components = [];
        for(let i = 0; i < this.props.columnsNumber; i++){
            components.push(
                <View key={i} style={styles.modalRow}>
                    {this.createButton(this.props.line, i)}
                    {this.props.columnsImages[i] === '' || !this.props.visible ? null:
                        <Image source={{uri: this.props.columnsImages[i]}} style={styles.image} resizeMode={'contain'}/>
                    }
                    <Text style={styles.modalText}>
                        {this.props.columnsLabels[i]}
                    </Text>
                </View>
            );
        }

        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.updateVisibility(this.props.line)}
            >
            <View style={styles.modalBlur}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {this.props.title}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                        {this.props.subtitle}
                    </Text>
                    <ScrollView style={styles.modalBody}>
                        {components}
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableWithoutFeedback onPress={() => this.props.updateVisibility(this.props.line)}>
                            <View style={styles.modalFooterChild}>
                                <Text style={styles.modalFooterText}>
                                    {'FERMER'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
          </Modal>
        );
    }

} export default ChoiceDialog;