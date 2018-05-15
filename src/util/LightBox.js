import React,{ Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from 'react-native-elements'

class LightBox extends Component{
    dismissLightBox = () =>{
        this.props.navigator.dismissLightBox();
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style ={styles.dtiLabel} >DTI: <Text style = {styles.dtiValue} >{this.props.dti}%</Text> </Text>
                <Button title = "DISMISS" onPress ={this.dismissLightBox} buttonStyle = {styles.dismissButton} />
            </View>
        )
    }
}

export default LightBox;

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        margin:15,
        padding: 20,
        alignItems: 'center',
        borderRadius: 5,
    },
    dtiLabel:{
        fontSize:24,
        margin:10
    },
    dtiValue:{
        fontSize: 34,
        fontWeight: 'bold'
    },
    dismissButton:{
        backgroundColor: '#F73535',
        margin:20,
        borderRadius: 5
    }
})