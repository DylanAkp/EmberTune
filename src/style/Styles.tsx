import { StyleSheet } from 'react-native';

const sidebar = StyleSheet.create({
    sidebar: {
        height: "100%",
        width: "50%",
        maxWidth: 400,
        padding: 16,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    title: {
        fontSize: 35,
        textAlign: 'center',
    },
});

const page = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    text: {
        fontSize: 20,
    },
});

export { sidebar, page };