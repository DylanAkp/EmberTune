import { StyleSheet } from 'react-native';

const sidebar = StyleSheet.create({
    sidebar: {
        height: "100%",
        width: "50%",
        maxWidth: 400,
        padding: 16,
        display: 'flex',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 35,
        textAlign: 'center',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    }
});

const page = StyleSheet.create({
    content: {
        flex: 1,
        padding: 20,
    },
    text: {
        fontSize: 20,
    },
});

const searchBar = StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 30,
      padding: 5,
      flex: 1,
      justifyContent: 'center',
    },
    searchInput: {
      flex: 1,
      height: 50,
      borderRadius: 25,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 12,
      fontSize: 16,
    },
    searchIcon: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
      marginLeft: 10,
      cursor: 'pointer',
    },
  });

export { sidebar, page, searchBar };