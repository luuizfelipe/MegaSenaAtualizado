import { StatusBar } from 'expo-status-bar';
import qs from 'qs';
import {useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Linking } from 'react-native';
import jogoDatabase from './JogoDatabase';

export default function App() {

  const [numeroGames, setnumeroGames] = useState<number>(0);
  const [geradorNumeros, setgeradorNumeros] = useState<any>([]);
  const [maxNumero, setmaxNumero] = useState<number>(60);
  const [email, setemail] = useState<string>('');
  const [sorteioValor, setsorteioValor] = useState<any>(
    {
      value0: '',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
    }
  );


  function clickButton(numeroGames: number) {
    let auxArray = []
    let list = [];
    for (let vxExecutado = 0; vxExecutado < numeroGames; vxExecutado++) {
      list = [];
      let NumeroAleatorio;
      let tmp;

      for (let i = 0; i < maxNumero; i++) {
        list[i] = i + 1;
      }

      for (let i = list.length; i;) {
        NumeroAleatorio = Math.random() * i-- | 0;
        tmp = list[NumeroAleatorio];
        
        list[NumeroAleatorio] = list[i];
       
        list[i] = tmp;
      }

      auxArray.push(list);
    }

    salvarJogo(auxArray);
    setgeradorNumeros(auxArray);
  }

  async function sendEmail(to: any, subject: any, body: any) {

    let url = `mailto:${to}`;

    
    const query = qs.stringify({
      subject: subject,
      body: body,
    });

    if (query.length) {
      url += `?${query}`;
    }

   
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      throw new Error('Url não entrontrada');
    }

    return Linking.openURL(url);
  }

  function transObjeto() {
    let corpo = ``;

    const converter = geradorNumeros.map((item: any[], index1: any) => {
      corpo = corpo.concat(`\n`)
      item.map((numeroArray: string, index2: number) => {
        if (index2 < 6) {
          return corpo = corpo.concat('' + numeroArray + '');
        }

      })

    })

    return corpo;

  }

  function verificarValor(values: any) {
    let auxArray: any[] = [];
    let matches = 0;
    values.map((value: any[], index: any) => {
      value.map((itemOfArray, index) => {

        if (String(itemOfArray) === String(sorteioValor[`value${index}`])) {
          matches++;

        }

      })
      auxArray.push(matches);

      matches = 0;

    })
   console.log(auxArray);
   
    registarJogosanTabela();
    return auxArray;
  }

  function conference() {

    let acertos = verificarValor(geradorNumeros)

    let mensagemJogo = '';
    let quadra = 0;
    let quina = 0;
    let sena = 0;

    acertos.forEach((element, index) => {
      mensagemJogo += `Jogo [${index + 1}] houveram [${element}] acerto(s) \n`
      if (Number(element) === 4) {
        quadra++;
      }
      if (Number(element) === 5) {
        quina++;
      }
      if (Number(element) === 6) {
        sena++;
      }


    });
    registarJogosanTabela();
    alert(mensagemJogo + '\n' +
      "Jogo(s) ganho(s) com a sena : " + sena + "\n" +
      "Jogo(s) ganho(s) com a quina : " + quina + "\n" +
      "Jogo(s) ganho(s) com a quadra : " + quadra + "\n"
    )
  }
  async function salvarJogo(data: any) {
    jogoDatabase.dropTable();
    jogoDatabase.createTable();

    for (let game of data) {

      return jogoDatabase.create({ sortedNumbers: game })
      .then(id => console.log('Jogo Criado com o ID: ' + id))
      .catch(err => console.log(err))
       
    }
  }

  
  function registarJogosanTabela() {
    {
      jogoDatabase.all()
        .then(
          game => game.forEach((register: any) => console.log(`id:${register.id}, values:${register.sortedNumbers}`))
        )
    }
  }

  return (
    <ScrollView key="scroolView">
      <View style={styles.container} key="17">
      <Text style={styles.title}> Gerador da Mega-Sena</Text>
        <Text key="11">Insera a quantidade de jogos</Text>
        <TextInput
          key="12"
          keyboardType="decimal-pad"
          style={styles.input}
          onChangeText={(e) => { setnumeroGames(Number(e)) }}
          value={String(numeroGames)}
        />
        <Button
         key="13"  
         title="Gerar Número" 
         color="#6C7B8B"
         onPress={(e) => { clickButton(Number(numeroGames)) }}
          />
          <Text>
            insira um E-mail
            </Text>
        <TextInput
        
        key="14"
          style={styles.inputEmail}
          onChangeText={(e) => { setemail(e) }}
          value={String(email)}
        />
        <Button title="Enviar Email" key="15" color="#6C7B8B"
         onPress={(e) => {
          const body = transObjeto()
          sendEmail(email, 'Números Mega Sena', body)
        }} />
        <StatusBar key="16" style="auto" />
      </View>
      <View key="VisualizarSorteio">
        {geradorNumeros.map((item: any, index: number) => (
          <View style={styles.viewSorted} key={index}>
            {
              item.map((value: any, secondIndex: number) => {
                return secondIndex < 6 && (
                  <>
                    <View key={secondIndex} >
                      <Text key={secondIndex + index}
                        style={
                          {  
                            margin: 5,
                            minWidth: 10,
                            maxHeight: 50,
                            textAlign: 'center',
                            
                          }
                        }
                      >
                        {`${value}`}
                      </Text>

                    </View>
                  </>
                )
              }
              )}
          </View>
        ))}
      </View>
      <View style={styles.sortedNumbers} key="1">
        <Text
          style={
            {
              textAlign: 'center',
              margin: 10,
              fontSize: 25
            }
          }
        >
          Digite as Dezenas Sorteadas:
        </Text>

        <View style={styles.inputsContainer} key="3">
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setsorteioValor({ ...sorteioValor, value0: e })
            }}
            key="4"
            value={String(sorteioValor.value0)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setsorteioValor({ ...sorteioValor, value1: e })
            }}
            key="5"
            value={String(sorteioValor.value1)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setsorteioValor({ ...sorteioValor, value2: e })
            }}
            key="6"
            value={String(sorteioValor.value2)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setsorteioValor({ ...sorteioValor, value3: e })
            }}
            key="7"
            value={String(sorteioValor.value3)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setsorteioValor({ ...sorteioValor, value4: e })
            }}
            key="8"
            value={String(sorteioValor.value4)}
          />
          <TextInput
            style={styles.sortedInput}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setsorteioValor({ ...sorteioValor, value5: e })
            }}
            key="9"
            value={String(sorteioValor.value5)}
          />
        </View>
        <Button title="Verificar Jogos"
        color="#6C7B8B"
         key="10" onPress={(e) => {
          conference()
        }} />
      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,

  },
  viewSorted: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  input: {
    height: 40,
    width: 70,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputEmail: {
    height: 40,
    width: 400,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  sortedNumbers: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  sortedInput: {
    backgroundColor: '#CAE1FF',
    height: 60,
    width: 60,
    margin: 4,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },

  title: {
    paddingVertical: 100,
    fontSize: 32,
    fontWeight: 'bold',
  }
});
