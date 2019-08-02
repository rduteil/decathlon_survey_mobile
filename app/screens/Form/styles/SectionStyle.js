import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        margin: 5,
        borderColor: COLOR_PALETTE.secondaryColor.S700,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 2,
    },
    rowContainer: {
        padding: 5,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: COLOR_PALETTE.white,
        borderRadius: 2,
    },
    nameText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR_PALETTE.secondaryColor.S500,
        marginBottom: 5,
    },
    descriptionText: {
        textAlign: 'center',
        fontSize: 16,
        color: COLOR_PALETTE.secondaryColor.S500,
        marginBottom: 5,
    },
    imageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 400,
        height: 200,
        borderRadius: 5
    },
});

export default styles;