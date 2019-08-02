import React, { Component } from 'react';
import { View, ScrollView, Text, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';

import FuckinCheckbox from '../../../imports/components/FuckinCheckbox';
import FuckinRadioButton from '../../../imports/components/FuckinRadioButton';
import styles from '../../../imports/styles/ModalStyle';

class FilterDialog extends Component {
    onChangeButton = (isRadioButton, line, column) => {
        switch(line){
            case 0:
                this.props.setFilter('active', !this.props.filters.active);
                break;
            case 1:
                let hangout = this.props.filters.hangout.slice();
                if(hangout[column] === false){
                    hangout[column] = true;
                    hangout[column === 1 ? 0: 1] = false;
                }
                else {
                    hangout[column] = false;
                }
                this.props.setFilter('hangout', hangout);
                break;
            case 2:
                let answer = this.props.filters.answer.slice();
                if(answer[column] === false){
                    answer[column] = true;
                    answer[column === 1 ? 0: 1] = false;
                }
                else {
                    answer[column] = false;
                }
                this.props.setFilter('answer', answer);
                break;
            default:
                break;
        }
    };

    render(){
        return(
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.cancelFilters()}
            >
            <View style={styles.modalBlur}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {'Filtrer les questionnaires'}
                    </Text>
                    <ScrollView style={styles.modalBody}>
                        <Text>
                            {'Choissisez les questionnaires à afficher'}
                        </Text>
                        <View style={styles.modalRow}>
                            <Text>
                                {'Filtrer par nom : '}
                            </Text>
                            <TextInput
                                style={styles.modalText}
                                defaultValue={this.props.filters.name}
                                onChangeText={((e) => this.props.setFilter('name', e))}
                            />
                        </View>
                        <View style={styles.modalSeparator}/>
                        <View style={styles.modalRow}>
                            <FuckinCheckbox
                                checked={this.props.filters.active}
                                line={0}
                                column={0}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Actifs seulement'}
                            </Text>
                        </View>
                        <View style={styles.modalSeparator}/>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.filters.hangout[0]}
                                line={1}
                                column={0}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Encadrés seulement'}
                            </Text>
                        </View>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.filters.hangout[1]}
                                line={1}
                                column={1}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Longue durées seulement'}
                            </Text>
                        </View>
                        <View style={styles.modalSeparator}/>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.filters.answer[0]}
                                line={2}
                                column={0}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Avec des réponses en attente'}
                            </Text>
                        </View>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.filters.answer[1]}
                                line={2}
                                column={1}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Avec des réponses envoyées'}
                            </Text>
                        </View>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableWithoutFeedback onPress={() => this.props.saveFilters()}>
                            <View>
                                <Text style={styles.modalFooterText}>
                                    {'VALIDER'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback> 
                        <TouchableWithoutFeedback onPress={() => this.props.cancelFilters()}>
                            <View>
                                <Text style={styles.modalFooterText}>
                                    {'ANNULER'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.resetFilters()}>
                            <View>
                                <Text style={styles.modalFooterText}>
                                    {'EFFACER'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>                       
                    </View>
                </View>
            </View>
          </Modal>
        );
    }
    
} export default FilterDialog;