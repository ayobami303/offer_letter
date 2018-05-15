import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import Icon from "react-native-vector-icons/Ionicons";

import { _decrypt, _encrypt, amountFormatter } from "./util/collection";
import ProductSpinner from "./util/ProductSpinner";
import TenorSpinner from './util/TenorSpinner';

class DTICalculator extends Component{
    constructor(props){
        super(props)

        this.state = {
            interestList: [],
            otherLoanInput: [],
            otherLoan: [""],
            otherLoanCount: 0,
            amount: '',
            salary: '',
            product: 'select',
            tenor: 'select',
            productIndex: 0,
            repayment: '',
            dti: '',
            amountError: '',
            tenorError: '',
            productError: '',
            salaryError: '',
        }
    }

    componentDidMount(props){
        const interestArray = this.props.interest.split(",");
        
        this.setState({
            interestList: interestArray
        })
    }

    _addOtherLoan = () =>{      
        const { otherLoan, otherLoanCount } = this.state
        const otherLoanInput = [];
        otherLoanInput.push(
            <FormInput
                value={this.state.otherLoan[otherLoanCount + 1]}
                placeholder="OTHER LOANS AMOUNT"
                keyboardType="numeric"
                key={otherLoanCount+1}
                onChangeText={(text) => this.onOtherChange(text, otherLoanCount + 1 )}
            />
        )

        this.setState(prevState => ({
            otherLoanInput: [...this.state.otherLoanInput, otherLoanInput],
            otherLoanCount: otherLoanCount + 1
        }))
    }

    onAmountChange = (text) =>{
       if (text.trim() === '') {
            this.setState({ amountError: 'loan amount can not be blank' })
        } else {
            this.setState({ amountError: '' })
        }
        this.setState({ amount: amountFormatter(text.trim()) }, this.computeRepayment)  
    }

    onProductChange = (text, itemIndex) =>{
        // alert(itemIndex)
        if (text.trim() === 'select') {
            this.setState({ productError: 'pls select a product' })
        } else {
            this.setState({ productError: '' })
        }
        this.setState({ product: text, productIndex: itemIndex }, this.computeRepayment)
    }

    onTenorChange = (text) =>{
        if (text.toString() === 'select') {
            this.setState({ tenorError: 'pls select a tenor' })
        } else {
            this.setState({ tenorError: '' })
        }
        this.setState({ tenor: text }, this.computeRepayment)
    }

    onSalaryChange = (text) =>{
        if (text.trim() === '') {
            this.setState({ salaryError: 'salary amount can not be blank' })
        } else {
            this.setState({ salaryError: '' })
        }
        this.setState({ salary: amountFormatter(text.trim()) }) 
    }

    onOtherChange = (text, otherLoanPos) =>{       
        const { otherLoan, otherLoanCount}  = this.state;        
        const key = "otherLoan" + otherLoanPos
        
        const tempArray = []
        if(otherLoan.length !== 0){
            for (let i = 0; i < otherLoanCount+1; i++) {
                // alert(otherLoanPos + ' ' + otherLoanCount)
                if (otherLoanPos === i) {
                    tempArray.push(amountFormatter(text.trim()))                
                }else{
                    tempArray.push(otherLoan[i])
                }            
            }
            this.setState({
                otherLoan: tempArray
            })
        }else{
            this.setState((prevState => ({
                otherLoan: [...this.state.otherLoan, amountFormatter(text.trim())] })
            ))
        }        
    }

    removeAmountFormat = (amount) =>{
        const formattedAmount = amount.toString().replace('₦', '')
        const newAmount = formattedAmount.split(',').join('')
        return newAmount;
    }

    computeRepayment = () =>{
        const { amount, product, tenor, productIndex, interestList } = this.state

        if (product !== 'select' && amount !== '' && tenor !== 'select') {                        
            const v_rate_use = interestList[parseInt(productIndex) - 1]/1200;
            console.log(interestList[parseInt(productIndex)])
            console.log(v_rate_use)
            const v_fee_amt = 0;

            const repayment = Math.round(Math.abs(parseInt(this.removeAmountFormat(amount)) * (v_rate_use) * (Math.pow((1 + (v_rate_use)), tenor)) / (1 - Math.pow((1 + (v_rate_use)), tenor))), 0) + v_fee_amt;
        
            console.log("repayment: ", repayment)
            this.setState({ repayment: amountFormatter(repayment)})
        }
    } 
    // rate /1200


    computeDTI = (otherLoanTotal) =>{
        const { salary, repayment} = this.state

        var dti = (otherLoanTotal + parseInt(this.removeAmountFormat(repayment))) / this.removeAmountFormat(salary)
        return parseFloat(dti);
    }

    onSubmit(){
        const { amount, product, tenor, salary, otherLoan, repayment, interestList } = this.state
        let errorCount = 0

        if (amount === '') {
            this.setState({ amountError: 'loan amount can not be blank' })
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

        if (salary === '') {
            this.setState({ salaryError: 'salary amount can not be blank' })
            errorCount++
        }

        if (repayment === '') {
            this.setState({ repaymentError: 'repayment amount can not be blank' })
            errorCount++
        }

        let otherLoanTotal = 0
        otherLoan.forEach(value => {
            if (value !== null && value !== 0 && value !== undefined && value !== '') {
                otherLoanTotal = otherLoanTotal + parseInt(this.removeAmountFormat(value))
            }
        });        
        
        if (errorCount <= 0) {            

            this.props.navigator.showLightBox({
                screen: 'offer_letter.LightBox',
                passProps: {
                    dti: Math.round(this.computeDTI(otherLoanTotal) * 100)
                },
                style: {
                    backgroundBlur: "dark",
                    backgroundColor: "rgba(5, 14, 13, 0.5)",
                    tapBackgroundToDismiss: false
                }
            })
        
        } else {
            alert("Pls fill all specified field correctly.")
        }
    }
    
    render(){ 
        return(
            <View style = {styles.container}>
                <ScrollView>
                    <View style = {styles.formContainer}>
                        <FormLabel>LOAN AMOUNT</FormLabel>
                        <FormInput
                            value={this.state.amount}
                            placeholder="LOAN AMOUNT"
                            keyboardType="numeric"
                            onChangeText={(text) => this.onAmountChange(text)}
                        />
                        <FormValidationMessage>{this.state.amountError}</FormValidationMessage>

                        <FormLabel>SELECT PRODUCT TYPE </FormLabel>
                        <View style={styles.picker} >
                            <ProductSpinner onProductChange={this.onProductChange}
                                productList={this.props.productList}
                                product={this.state.product} />

                        </View>
                        <FormValidationMessage>{this.state.productError}</FormValidationMessage>

                        <FormLabel>SELECT TENOR</FormLabel>
                        <View style={styles.picker} >
                            <TenorSpinner
                                onTenorChange={this.onTenorChange}
                                tenor={this.state.tenor} tenorList={this.props.itemArray} />

                        </View>
                        <FormValidationMessage>{this.state.tenorError}</FormValidationMessage>

                        <FormLabel>SALARY AMOUNT</FormLabel>
                        <FormInput
                            value={this.state.salary}
                            placeholder="SALARY AMOUNT"
                            keyboardType="numeric"
                            onChangeText={(text) => this.onSalaryChange(text)}
                        />
                        <FormValidationMessage>{this.state.salaryError}</FormValidationMessage>

                        <FormLabel>OTHER LOANS AMOUNT</FormLabel>
                        <View style = {styles.otherLoanView}>
                            <View style={{ flex: 2 }}>
                                <FormInput                                
                                    value={this.state.otherLoan[0]}
                                    placeholder="OTHER LOANS AMOUNT"
                                    keyboardType="numeric"
                                    onChangeText={(text) => this.onOtherChange(text, 0)}
                                />
                                {this.state.otherLoanInput}
                            </View>
                            <Text style={styles.addText} onPress = {this._addOtherLoan} >
                                <Icon name="md-add" size={20} color="#f24d0c" /> ADD NEW </Text>
                        </View>

                        <View style = {styles.repayment} >
                            <Text style = {styles.repaymentLabel} >Repayment Amount:  <Text style = {styles.repaymentValue} >{this.state.repayment}</Text></Text>
                        </View>
                        <Button title="CALCULATE" onPress={this.onSubmit.bind(this)} buttonStyle={styles.submitButton} />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default DTICalculator;

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        flex: 1
    },
    formContainer:{
        margin: 20
    },
    picker:{
        backgroundColor: '#e5e5e5',
        margin: 15
    },
    otherLoanView:{
        flexDirection:"row",
        flex:1
    },
    addText:{
        flex: 1, 
        fontSize: 20,
        padding:10
    },
    submitButton: {
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: '#f24d0c'
        // paddingTop:10	
    },
    repayment:{
        padding:15
    },
    repaymentLabel:{
        fontSize: 18
    },
    repaymentValue:{
        fontSize: 24,
        fontWeight: 'bold'
    }
})