import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F4ECE1",
  },
  logo: {
    width: 200,
    height:   
 200,
    marginBottom: 20,
  },
  
  text:   
 {
    position: 'absolute',
    color: 'white', 
    fontSize: 24,
    textAlign: 'center',
  },
  containerPadre:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  padreboton:{
    alignItems: "center",
  },
  cajaboton:{
    backgroundColor:"#628CC6",
    borderRadius:30,
    paddingVertical:20,
    width:150,
    marginTop:20,
  },
  textoboton:{
    textAlign: "center",
    color: "white"
  },

});


export default styles;