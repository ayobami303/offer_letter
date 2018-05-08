import React from 'react'
import { Navigation } from 'react-native-navigation'
import { registerScreens } from './screens'

registerScreens();

const appStyle = {
	statusBarColor: '#f2632b',
	statusBarTextColorScheme: 'light',
	navigationBarColor: '#000',
	navBarBackgroundColor: '#f24d0c', 
	navBarTextColor: 'white',
	navBarButtonColor: 'white',	
	topBarElevationShadowEnabled: true,	
}

Navigation.startSingleScreenApp({
    screen:{
        screen: 'offer_letter.form',
        title: 'Offer Letter',
        navigatorStyle: appStyle
    }
})