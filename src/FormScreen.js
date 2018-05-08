import React, { Component } from 'react'
import { View, Text, ScrollView, Picker, StyleSheet, ActivityIndicator } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import soap from 'soap-everywhere'


class FormScreen extends Component{
    constructor(props){
        super(props)

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
        
        this.state = {
            productList: [],
            isProductLoading: true,
            product: 'select',
            salaryDate: today,
            tenor: 'select',
            firstnameError: '',
            surnameError: '',
            productError: '',
            salaryDateError: '',
            tenorError: '',
            emailError: '',
            amountError: '',
            addressError: ''
        }
    }

    componentDidMount(){
        this.get_product();
    }

    get_product = () =>{
        const args = {
            ProductName: ''
        }

        const thiss = this
        soap.createClient('https://infolink.pagemfbank.com:6699/offer_service.php?wsdl', function(err, client) {
            client.GetProducts(args, function(err, result) {
                // alert(JSON.stringify(result));
                const ProductName = result.ProductName
                const productArray = ProductName.split(",");
                
                const productList = [];
                productArray.forEach(element => {
                    productList.push(<Picker.Item label={element} value={element} key={element} />)
                });
                
                thiss.setState(prevState => ({
                    productList: [...thiss.state.productList, productList],
                    isProductLoading: false
                }))
            });
        });
    }

    onFirstnameChange = (text) =>{
        if (text.trim() === '') {
            this.setState({firstnameError: 'firstname can not be blank'})
        }else{
            this.setState({ firstnameError: '' })
            // alert(text)
        }
    }

    onSurnameChange = (text) =>{

    }

    onSubmit(){
        alert("submitted")
    }

    render(){
        const itemArray = [];

        for (let i = 1; i < 37; i++) {            
            itemArray.push(<Picker.Item label= {i.toString()} value= {i} key = {i} />)
        }
        return(            
                this.state.isProductLoading ? 
                    <View style={styles.indicatorContainer} >
                        <ActivityIndicator style={styles.indicator} size="large" color="#f24d0c" />
                    </View> :  

                <View style = {styles.container} >
                    <ScrollView>
                        <View style ={styles.formContainer} >
                            <FormLabel>FIRSTNAME</FormLabel>
                            <FormInput 
                                placeholder = "FIRSTNAME" 
                                onChangeText = {(text) =>this.onFirstnameChange(text)}
                            />
                            <FormValidationMessage>{this.state.firstnameError}</FormValidationMessage>
                            <FormLabel>SURNAME</FormLabel>
                            <FormInput 
                                placeholder = "SURNAME"
                                onChangeText = {(text) =>{this.onSurnameChange(text)}}    
                            />
                            <FormLabel>SELECT PRODUCT TYPE </FormLabel>
                            <View style = {styles.picker} >
                                <Picker
                                    selectedValue={this.state.product}
                                    style={{ height: 50, width: 300 }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({product: itemValue})}>
                                    <Picker.Item label="SELECT PRODUCT TYPE" value="select" />
                                    {this.state.productList}
                                </Picker>                        
                            </View>
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
                                <Picker
                                    selectedValue={this.state.tenor}
                                    style={{ height: 50, width: 300 }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({tenor: itemValue})}>
                                    <Picker.Item label="SELECT TENOR" value="select" />
                                    {itemArray}
                                </Picker>
                            </View> 
                            <FormLabel>EMAIL</FormLabel>
                            <FormInput placeholder = "EMAIL" keyboardType = "email-address" />
                            <FormLabel>LOAN AMOUNT</FormLabel>
                            <FormInput placeholder = "LOAN AMOUNT" keyboardType = "numeric"/>
                            <FormLabel>HOUSE ADDRESS</FormLabel>
                            <FormInput 
                                multiline = {true}
                                numberOfLines = {3}
                                placeholder = "HOUSE ADDRESS" />
                            <Button title= "SUBMIT" onPress = {this.onSubmit.bind(this)} buttonStyle = {styles.submitButton}/>
                        </View>
                    </ScrollView>                             
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
    indicatorContainer:{
        alignItems: 'center',
        flex:1,
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    indicator:{
        backgroundColor: 'pink',
        alignSelf: 'center',
        padding: 10,
        borderRadius:5
    }
})