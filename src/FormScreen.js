import React, { Component } from 'react'
import { View, Text, ScrollView, Picker, StyleSheet, ActivityIndicator } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import soap from 'soap-everywhere'
import { Navigation } from "react-native-navigation";
import CryptoJS from "crypto-js";

import { _decrypt, _encrypt, amountFormatter } from "./util/collection";
import ProductSpinner from "./util/ProductSpinner";
import TenorSpinner from './util/TenorSpinner';

const itemArray = [];

for (let i = 1; i < 37; i++) {
    itemArray.push(<Picker.Item label={i.toString()} value={i} key={i} />)
}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;

const appStyle = {
    statusBarColor: '#f2632b',
    statusBarTextColorScheme: 'light',
    navigationBarColor: '#000',
    navBarBackgroundColor: '#f24d0c',
    navBarTextColor: 'white',
    navBarButtonColor: 'white',
    topBarElevationShadowEnabled: true,
}

class FormScreen extends Component{
    constructor(props){
        super(props)

        this.state = {
            productList: [],
            interest: '',
            isProductLoading: true,
            isLoading: false,
            firstname:'',
            surname: '',
            product: 'select',
            salaryDate: today,
            tenor: 'select',
            email: '',
            amount: '',
            address: '',
            isValidEmail: false,
            firstnameError: '',
            surnameError: '',
            productError: '',
            salaryDateError: '',
            tenorError: '',
            emailError: '',
            amountError: '',
            addressError: ''
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))        
    }
    
    onNavigatorEvent(event){
        if(event.type == 'NavBarButtonPress'){
            if (event.id == 'logout') {                
                // alert("logout pressed")
                this.props.navigator.pop({
                    animated: true,
                    animationType: 'fade', 
                })
            } 

            if(event.id == 'calculator'){
                // alert("pressed")
                this.props.navigator.showModal({
                    screen: 'offer_letter.DTICalculator',
                    title: "DTI Calculator",
                    passProps:{
                        productList: this.state.productList,
                        itemArray,
                        interest: this.state.interest
                    },
                    navigatorStyle: appStyle,
                    animationType: 'slide-up'
                })
            }
        }
    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'logout',
                id: 'logout',
                buttonFontSize: 14,
                buttonFontWeight: 'bold'
            }
        ],
        fab: {
            collapsedId: 'calculator',
            collapsedIcon: require('./assets/cal.png'),
            collapsedIconColor: 'white', // optional
            backgroundColor: '#f24d0c'
        },
        animated: true
    }
    
    componentDidMount(){
        this.get_product();
        
        

    }
    
    get_product = () =>{
        const args = {
            ProductName: ''
        }
        // console.log(JSON.stringify("encResult"));

        const thiss = this

        soap.createClient('https://pagefinancials.com/OfferLetter/offer_service.php?wsdl', function(err, client) {
            client.GetProducts(args, function(err, encResult) {
                // console.log(JSON.stringify(_decrypt(encResult.ProductName)));
                // console.log(JSON.stringify(_decrypt(encResult.Interest)));

                const productName = _decrypt(encResult.ProductName)
                const interest = _decrypt(encResult.Interest)
                const productArray = productName.split(",");
                
                const productList = [];
                productArray.forEach(element => {
                    productList.push(<Picker.Item label={element} value={element} key={element} />)
                });
                
                thiss.setState(prevState => ({
                    productList: [...thiss.state.productList, productList],
                    interest, 
                    isProductLoading: false
                }))
            });
        });
    }

    create_offer_letter = () =>{
        const { firstname, surname, product, salaryDate, tenor, email, isValidEmail, amount, address } = this.state
        
        const formattedAmount = amount.toString().replace('₦', '')
        const newAmount = formattedAmount.split(',').join('')

        const data = {
            "surname": surname,
            "firstname": firstname,
            "address": address,
            "amount": newAmount,
            "tenure": tenor,
            "start_date": salaryDate,
            "product": product,
            "email": email
        }

        const args = {
            Hash: _encrypt(data)
        }

        const thiss = this
        soap.createClient('https://pagefinancials.com/OfferLetter/offer_service.php?wsdl', function (err, client) {
            client.CreateOfferLetter(args, function (err, result) {
                console.log(result)
                // alert(JSON.stringify(result));
                if (_decrypt(result.Status) == 'true') {
                    thiss.setState({
                        firstname: '',
                        surname: '',
                        product: 'select',
                        salaryDate: today,
                        tenor: 'select',
                        email: '',
                        amount: '',
                        address: '',
                        isValidEmail: false,
                    })
                    alert("Offer Letter Submitted Successfully.")
                }else{
                    alert("Something went wrong pls try again shortly.")
                }

                thiss.setState({
                    isLoading: false
                })
            });
        });
    }

    onFirstnameChange = (text) =>{
        if (text.trim() === '') {
            this.setState({ firstnameError: 'firstname can not be blank' })
        }else{
            this.setState({ firstnameError: '' })
            // alert(text)
        }
        this.setState({firstname: text})
    }

    onSurnameChange = (text) =>{
        if (text.trim() === '') {
            this.setState({ surnameError: 'surname can not be blank' })
        } else {
            this.setState({ surnameError: '' })
        }
        this.setState({ surname: text })
    }

    onProductChange = (text, itemIndex) =>{
        if (text.trim() === 'select') {
            this.setState({ productError: 'pls select a product' })
        } else {
            this.setState({ productError: '' })
        }
        this.setState({ product: text })
    }

    onTenorChange = (text) =>{
        if (text.toString() === 'select') {
            this.setState({ tenorError: 'pls select a tenor' })
        } else {
            this.setState({ tenorError: '' })
        }
        this.setState({ tenor: text })
    }

    onEmailChange = (text) => {
        if (text.trim() === '') {
            this.setState({ emailError: 'email address can not be blank', isValidEmail: false })
        } else {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(text).toLowerCase())){
                this.setState({ emailError: '', isValidEmail: true })
            }else{
                this.setState({ emailError: 'pls enter a valid email address', isValidEmail: false })                
            }
            
        }
        this.setState({ email: text.trim() })
    }

    onAmountChange = (text) => {
        if (text.trim() === '') {
            this.setState({ amountError: 'loan amount can not be blank' })
        } else {
            this.setState({ amountError: '' })
        }
        this.setState({ amount: amountFormatter(text.trim()) })        
    }

    onAddressChange = (text) => {
        if (text.trim() === '') {
            this.setState({ addressError: 'house address can not be blank' })
        } else {
            this.setState({ addressError: '' })
        }
        this.setState({ address: text })
    }

    onSubmit(){
        const { firstname, surname, product, salaryDate, tenor, email, isValidEmail, amount, address} = this.state
        let errorCount = 0

        if (firstname === '') {
            this.setState({ firstnameError: 'firstname can not be blank' })            
            errorCount++
        }

        if (surname === '') {
            this.setState({ surnameError: 'surname can not be blank' })
            errorCount++
        }

        if (product === 'select') {
            this.setState({ productError: 'pls select a product' })
            errorCount++
        }

        if (tenor === 'select') {
            this.setState({ tenorError: 'pls select a tenor' })
            errorCount++
        }

        if (email === '') {
            this.setState({ emailError: 'email can not be blank' })
            errorCount++
        }
        
        if (amount === '') {
            this.setState({ amountError: 'loan amount can not be blank' })
            errorCount++
        }

        if (address === '') {
            this.setState({ addressError: 'address can not be blank' })
            errorCount++
        }

        if ( isValidEmail && errorCount <= 0) {
                this.create_offer_letter();
                this.setState({
                    isLoading: true
                })
            // alert("firstname: " + firstname + '\nsurname: ' + surname + '\nproduct type: ' + product
            //         + '\nsalary date: ' + salaryDate + '\ntenor: ' + tenor + '\nemail: ' + email + '\namount: ' + amount + '\naddress: ' + address )            
                             
        }else{
            alert("Pls fill all specified field correctly.")
        }
    }

    render(){       
        return(            
                this.state.isProductLoading ? 
                    <View style={styles.pIndicatorContainer} >
                        <ActivityIndicator style={styles.pIndicator} size="large" color="#f24d0c" />
                    </View> :  

                <View style = {styles.container} >                    
                    <ScrollView>
                        <View style ={styles.formContainer} >
                            <FormLabel>FIRSTNAME</FormLabel>
                            <FormInput 
                                value = {this.state.firstname}
                                placeholder = "FIRSTNAME" 
                                onChangeText = {(text) =>this.onFirstnameChange(text)}
                            />
                            <FormValidationMessage>{this.state.firstnameError}</FormValidationMessage>

                            <FormLabel>SURNAME</FormLabel>
                            <FormInput 
                                value={this.state.surname}                            
                                placeholder = "SURNAME"
                                onChangeText = {(text) =>{this.onSurnameChange(text)}}    
                            />
                            <FormValidationMessage>{this.state.surnameError}</FormValidationMessage>
                            
                            <FormLabel>SELECT PRODUCT TYPE </FormLabel>
                            <View style = {styles.picker} >
                                <ProductSpinner onProductChange={this.onProductChange} 
                                    productList={this.state.productList}
                                    product ={this.state.product} />
                                                  
                            </View>
                            <FormValidationMessage>{this.state.productError}</FormValidationMessage>
                            
                            <FormLabel>SELECT SALARY DATE </FormLabel>
                            <View style ={styles.datepicker} >
                                <DatePicker 
                                    style={{width: 300}}
                                    date={this.state.salaryDate}
                                    mode="date"
                                    placeholder="select date"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => { this.setState({ salaryDate: date }) }}
                                />
                            </View>
                           
                            <FormLabel>SELECT TENOR</FormLabel>
                            <View style = {styles.picker} >
                                <TenorSpinner 
                                    onTenorChange = {this.onTenorChange} 
                                    tenor = {this.state.tenor} tenorList = {itemArray} />
                                
                            </View> 
                            <FormValidationMessage>{this.state.tenorError}</FormValidationMessage>
                            
                            <FormLabel>EMAIL</FormLabel>
                            <FormInput 
                                value={this.state.email}
                                placeholder = "EMAIL" 
                                autoCapitalize = 'none'
                                keyboardType = "email-address"
                                onChangeText = {(text) =>this.onEmailChange(text)}
                            />
                            <FormValidationMessage>{this.state.emailError}</FormValidationMessage>

                            <FormLabel>LOAN AMOUNT</FormLabel>
                            <FormInput 
                                value={this.state.amount}
                                placeholder = "LOAN AMOUNT" 
                                keyboardType = "numeric"
                                value = {this.state.amount}
                                onChangeText = {(text) =>this.onAmountChange(text)}
                            />
                            <FormValidationMessage>{this.state.amountError}</FormValidationMessage>
                            
                            <FormLabel>HOUSE ADDRESS</FormLabel>
                            <FormInput 
                                value={this.state.address}
                                multiline = {true}
                                numberOfLines = {3}
                                placeholder = "HOUSE ADDRESS" 
                                onChangeText = {(text) =>this.onAddressChange(text)}
                            />
                            <FormValidationMessage>{this.state.addressError}</FormValidationMessage>
                         
                            <Button title= "SUBMIT" onPress = {this.onSubmit.bind(this)} buttonStyle = {styles.submitButton}/>
                        </View>
                    </ScrollView>       
                    {this.state.isLoading &&
                        <View style={styles.indicatorContainer} >
                            <ActivityIndicator style={styles.indicator} size="large" color="#f24d0c" />
                        </View>
                    }                      
                </View>
        )
    }
}

export default FormScreen;

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    formContainer:{
        margin:20
    },
    picker:{
        backgroundColor: '#e5e5e5',
        margin: 15
    },
    datepicker:{
        margin: 15
    },
    submitButton:{
		marginTop: 20,
		borderRadius: 5,
		backgroundColor: '#f24d0c'
		// paddingTop:10	
    },
    pIndicatorContainer:{
        alignItems: 'center',
        flex:1,
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)'
    },
    pIndicator:{
        backgroundColor: '#E5E5E5',
        alignSelf: 'center',
        padding: 10,
        borderRadius:5
    },
    indicatorContainer:{
        flex:1,
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
    indicator:{
        backgroundColor: '#E5E5E5',
        alignSelf: 'center',
        padding: 10,
        borderRadius:5
    }
})