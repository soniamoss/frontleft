import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

const ViewStyleProps = () => {
  return (
        <View style={styles.container}>
            <View style={styles.box} />
        </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    //backgroundColor: '',
    padding: 20,
    margin: 10,
  },
  box: {
    flex: 0.3,
    backgroundColor: '#ffff',
    borderRadius: 20,
   
  },
  
});

export default ViewStyleProps;