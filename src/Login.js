import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { FormInput, FormValidationMessage, FormLabel, Button } from "react-native-elements";
import soap from 'soap-everywhere'
import { Navigation } from "react-native-navigation";

const appStyle = {
    statusBarColor: '#f2632b',
    statusBarTextColorScheme: 'light',
    navigationBarColor: '#000',
    navBarBackgroundColor: '#f24d0c',
    navBarTextColor: 'white',
    navBarButtonColor: 'white',
    topBarElevationShadowEnabled: true,
}

class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            username:'',
            password: '',
            isLoading: false
        }
    }

    onUsernameChange = (text) =>{
        this.setState({
            username:text
        })
    }

    onPasswordChange = (text) =>{
        this.setState({
            password: text
        })
    }

    onLogin = () =>{
        const { username, password } = this.state

        const args = {
            Username: username,
            Password: password
        }

        const thiss = this

        this.setState({
            isLoading: true
        })

        soap.createClient('https://infolink.pagemfbank.com:6699/offer_service.php?wsdl', function (err, client) {
            client.Authenticate(args, function (err, result) {
                if (result.Status == 'true') {                    
                    thiss.props.navigator.push({
                        screen: 'offer_letter.form',
                        title: 'Offer Letter',
                        backButtonHidden: true,
                        navigatorStyle: appStyle
                    })
                } else {
                    alert("Email/Password incorrect.")
                }

                thiss.setState({
                    isLoading: false
                })
            });
        });
    }
    
    render(){
        return(
            <View style = {styles.container}>
                <Image source ={require('./assets/logo.png')} style = {styles.logo}/>
                <View style = {styles.formContainer}>
                    <FormInput 
                        placeholder = 'Email address/Username'
                        onChangeText = {(text) =>{this.onUsernameChange(text)}} />
                    <FormInput 
                        placeholder = 'Password' 
                        secureTextEntry = {true} 
                        onChangeText = {(text =>{this.onPasswordChange(text)})}
                    />
                    <Button title = 'Login' buttonStyle = {styles.submitButton} onPress = {() => {this.onLogin()}} />
                </View>
                {this.state.isLoading &&
                    <View style={styles.indicatorContainer} >
                        <ActivityIndicator style={styles.indicator} size="large" color="#f24d0c" />
                    </View>
                } 
            </View>
        )
    }
}

export default Login;


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',

    },
    formContainer:{
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 82, 9, 0.3)',
        margin: 10,
        borderRadius: 5,
        paddingVertical: 30
    },
    logo:{
        width: 150,
        height: 70,
        alignSelf: 'center',
        marginBottom:20
    },
    submitButton:{
        backgroundColor: '#f24d0c',
        marginTop:10
    },
    indicatorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 3
    },
    indicator: {
        backgroundColor: '#E5E5E5',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 5
    }
})