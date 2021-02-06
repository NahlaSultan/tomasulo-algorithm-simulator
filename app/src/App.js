import './Styling.css'
import React, { useState,useRef } from 'react'

//we assume that multiplacation takes 4 cycles, add takes 2 and loads/store take 1
const mulCycles = 4
const addCycles = 2
const loadCycles = 1

function App() {
  var [notReady,setNotReady] = useState(true)

  const offsetInputRef = useRef()




  var [op, setop] = useState("")
  var [destination, setDestination] = useState("")
  var [j, setj] = useState("")
  var [k, setk] = useState("")

  //3 reservation stations for adds and subs
  var [RSAdd, setRSAdd] = useState([
    {
      op: "", //opcode
      name: "a1", //name of RS 
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "", //address
      busy: 0 //busy flag
    }, {
      op: "",
      name: "a2",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      busy: 0
    }, {
      op: "",
      name: "a3",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      busy: 0
    }])

    //2 reservation stations for muls and divs  
  var [RSMul, setRSMul] = useState([
    {
      op: "",
      name: "m1",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      busy: 0
    },
    {
      op: "",
      name: "m2",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      busy: 0
    }
  ])

  // 3 spots in load buffer
  var [loadBuffer, setLoadBuffer] = useState([
    {
      name: "l1",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      offset: "",
      busy: 0
    },
    {
      name: "l2",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      offset:"",
      busy: 0
    },
    {
      name: "l3",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      offset: "",
      busy: 0
    }
  ])

    // 3 spots in store buffer
  var [storeBuffer, setStoreBuffer] = useState([
    {
      name: "s1",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      offset: "",
      busy: 0
    },

    {
      name: "s2",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      offset: "",
      busy: 0
    },
    {
      name: "s3",
      vj: "",
      vk: "",
      qj: "",
      qk: "",
      a: "",
      offset: "",
      busy: 0
    }
  ])

  //register file initial values
  var [RF, setRF] = useState([
    {
      name: "r1",
      qi: "",
      data: "1"
    },
    {
      name: "r2",
      qi: "",
      data: "6"
    },
    {
      name: "r3",
      qi: "",
      data: "10"
    },
    {
      name: "r4",
      qi: "",
      data: "11"
    },
    {
      name: "r5",
      qi: "",
      data: "15"
    }
  ])
  const array = new Array(100).fill(0);

  var [cycle, setCycle] = useState(1)
  const [memory, setMemory] = useState(array)


  var [instructions, setInstructions] = useState([
  // {  op: "add",
  //   destination: "r1",
  //   j: "r2",
  //   k: "r3",
  //   issued: false,
  //   rs: "",
  //   issueCycle: "",
  //   executionBegin: "",
  //   executionEnd: "",
  //   writeCycle: ""
  // },
  // {
  //   op: "sub",
  //   destination: "r4",
  //   j: "r4",
  //   k: "r4",
  //   issued: false,
  //   rs: "",
  //   issueCycle: "",
  //   executionBegin: "",
  //   executionEnd: "",
  //   writeCycle: ""
  // },
  // {
  //   op: "mul",
  //   destination: "r5",
  //   j: "r5",
  //   k: "r1",
  //   issued: false,
  //   rs: "",
  //   issueCycle: "",
  //   executionBegin: "",
  //   executionEnd: "",
  //   writeCycle: ""
  // },
  // {
  //   op: "ld",
  //   destination: "r1",
  //   j: "r2",
  //   k: "",
  //   a: "",
  //   offset: "2",
  //   issued: false,
  //   rs: "",
  //   issueCycle: "",
  //   executionBegin: "",
  //   executionEnd: "",
  //   writeCycle: ""
  // },
  // {
  //   op: "st",
  //   destination: "r1",
  //   j: "r2",
  //   k: "r4",
  //   a: "",
  //   offset: "7",
  //   issued: false,
  //   rs: "",
  //   issueCycle: "",
  //   executionBegin: "",
  //   executionEnd: "",
  //   writeCycle: ""
  // }
 ])

  function chooseOP(e) {
    setop(e.target.value)
  }
  function choosek(e) {
    setk(e.target.value)
  }

  function choosej(e) {
    setj(e.target.value)
  }
  function chooseDestination(e) {
    setDestination(e.target.value)
  }
  function getResult(operation, op1, op2, address) {
    //load,store: vj represents el value of the register that we add to offset
    //store: vk represets the value we will write to the memory
    console.log("inputs")
    console.log(operation)
    console.log(op1)
    console.log(op2)
    console.log(address)

    var o1 = parseFloat(op1)
    var o2 = parseFloat(op2, 10)

    switch (operation) {
      case "add": return String(o1 + o2) ;
      case "sub": return String(o1 - o2);
      case "mul": return String(o1 * o2);
      case "div": return String(o1 / o2);
      //not sure
      case "ld": return readMem(address);
      case "st": writeMem(o2, address); break;

    }

  }





  function readMem(address) {
    return String(memory[address])
  }

  function writeMem(address, value) {
    const tmpMem = memory
    tmpMem[address] = value
    setMemory(tmpMem)
  }

  function emptystation(rs) {
    var tmpRSAdd = RSAdd
    var tmpRSMul = RSMul
    var loadBuffertmp = loadBuffer
    var storeBuffertmp = storeBuffer
    if (rs.startsWith("a")) {
      for (var j = 0; j < RSAdd.length; j++)
        if (RSAdd[j].name == rs) {
          tmpRSAdd[j] = {
            op: "",
            name: rs,
            vj: "",
            vk: "",
            qj: "",
            qk: "",
            a: "",
            busy: 0
          }
        }
      setRSAdd([...tmpRSAdd])
    }

    if (rs.startsWith("m")) {
      for (var j = 0; j < tmpRSMul.length; j++)
        if (tmpRSMul[j].name == rs) {
          tmpRSMul[j] = {
            op: "",
            name: rs,
            vj: "",
            vk: "",
            qj: "",
            qk: "",
            a: "",
            busy: 0
          }

        }
      setRSMul([...tmpRSMul])
    }

    if (rs.startsWith("s")) {
      for (var j = 0; j < storeBuffertmp.length; j++)
        if (storeBuffertmp[j].name == rs) {
          storeBuffertmp[j] = {
            name: rs,
            vj: "",
            vk: "",
            qj: "",
            qk: "",
            a: "",
            offset: "",
            busy: 0
          }
        }
      setStoreBuffer([...storeBuffertmp])


    }
    if (rs.startsWith("l")) {
      for (var j = 0; j < loadBuffertmp.length; j++)
        if (loadBuffertmp[j].name == rs) {
          loadBuffertmp[j] = {
            name: rs,
            vj: "",
            vk: "",
            qj: "",
            qk: "",
            a: "",
            offset: "",
            busy: 0
          }
        }
      setLoadBuffer([...loadBuffertmp])


    }
  }


  function getStation(rs) {

    if (rs.startsWith("a")) {
      console.log("in a ")
      for (var j = 0; j < RSAdd.length; j++)
        if (RSAdd[j].name == rs) {
          console.log("in a found")
          console.log(RSAdd[j])

          return RSAdd[j]
        }
    }

    if (rs.startsWith("m")) {
      for (var j = 0; j < RSMul.length; j++)
        if (RSMul[j].name == rs) {
          return RSMul[j]
        }
    }

    if (rs.startsWith("s")) {
      for (var j = 0; j < storeBuffer.length; j++)
        if (storeBuffer[j].name == rs) {
          return storeBuffer[j]
        }
    }

    if (rs.startsWith("l")) {
      for (var j = 0; j < loadBuffer.length; j++)
        if (loadBuffer[j].name == rs) {
          return loadBuffer[j]
        }
    }


  }


  function updateRS(rs, result) {
    var tmpRSAdd = RSAdd
    var tmpRSMul = RSMul
    var loadBuffertmp = loadBuffer
    var storeBuffertmp = storeBuffer


    for (var j = 0; j < tmpRSAdd.length; j++) {
      if (tmpRSAdd[j].qj == rs) {
        tmpRSAdd[j].qj = ""
        tmpRSAdd[j].vj = result

        setRSAdd([...tmpRSAdd])
      }
      if (tmpRSAdd[j].qk == rs) {
        tmpRSAdd[j].qk = ""
        tmpRSAdd[j].vk = result

        setRSAdd([...tmpRSAdd])
      }
    }




    for (var j = 0; j < tmpRSMul.length; j++) {
      if (tmpRSMul[j].qj == rs) {
        tmpRSMul[j].qj = ""
        tmpRSMul[j].vj = result
        setRSMul([...tmpRSMul])
      }
      if (tmpRSMul[j].qk == rs) {
        tmpRSMul[j].qk = ""
        tmpRSMul[j].vk = result
        setRSMul([...tmpRSMul])
      }

    }


    for (var j = 0; j < storeBuffertmp.length; j++) {
      if (storeBuffertmp[j].qj == rs) {
        storeBuffertmp[j].qj = ""
        storeBuffertmp[j].vj = result
        setStoreBuffer([...storeBuffertmp])
      }
      if (storeBuffertmp[j].qk == rs) {
        storeBuffertmp[j].qk = ""
        storeBuffertmp[j].vk = result
        setStoreBuffer([...storeBuffertmp])
      }

    }

    for (var j = 0; j < loadBuffertmp.length; j++) {
      if (loadBuffertmp[j].qj == rs) {
        loadBuffertmp[j].qj = ""
        loadBuffertmp[j].vj = result
        setLoadBuffer([...loadBuffertmp])
      }
      if (loadBuffertmp[j].qk == rs) {
        loadBuffertmp[j].qk = ""
        loadBuffertmp[j].vk = result
        setLoadBuffer([...loadBuffertmp])
      }

    }
  }



  const headerI = ["OP", "Destination", "J", "K", "Issued", "RS", "Issue Cycle", "Execution Begin", "Execution End", "Write Cycle"]
  function renderIHeader() {
    return headerI.map((key) => {
      return <th >{key.toUpperCase()}</th>
    })
  }

  function renderI() {
    var isIssued = "NO"
    return instructions.map((station) => {
      if (station.issued)
        isIssued = "YES"
      else
        isIssued = "NO"
      return (
        <tr key={station.op}>
          <td>{station.op}</td>
          <td>{station.destination}</td>
          <td>{station.j}</td>
          <td>{station.k}</td>
          <td>{isIssued}</td>
          <td>{station.rs}</td>
          <td>{station.issueCycle}</td>
          <td>{station.executionBegin}</td>
          <td>{station.executionEnd}</td>
          <td>{station.writeCycle}</td>
        </tr>
      )



    })
  }


  //checks if there's a non busy slot in the array
  function isFull(array) {

    for (var i = 0; i < array.length; i++) {
      if (array[i].busy == 0)
        return false
    }
    return true;
  }

  //let regj = RF.find(o => o.name === ins.j);

  // function regFind(insReg) {
  //   for (var i = 0; i < RF.length; i++)
  //     if (RF.name == insReg)
  //       return RF[i]
  // }


  function regSet(insReg, qi) {
    var tmpRF = RF
    for (var i = 0; i < tmpRF.length; i++)
      if (tmpRF[i].name == insReg)
        tmpRF[i].qi = qi
    setRF([...tmpRF])
  }

  function regSetData(insReg, data) {
    var tmpRF = RF
    for (var i = 0; i < tmpRF.length; i++)
      if (tmpRF[i].name == insReg) {
        console.log("reg found")
        console.log(data)
        tmpRF[i].data = data
      }
    setRF([...tmpRF])
  }

  function updateRF(registerName, stationName) {
    var tmpRF = RF
    for (var i = 0; i < tmpRF.length; i++)
      if (tmpRF[i].name == registerName) {
        if (tmpRF[i].qi == stationName) {
          tmpRF[i].qi = ""
        }
      }
    setRF([...tmpRF])
  }



  function Tomasulo() {

    //loop on input and initilize instruction array
    console.log("EXEC")
    var tmpRSAdd = RSAdd
    var tmpRSMul = RSMul
    var loadBuffertmp = loadBuffer
    var storeBuffertmp = storeBuffer
    var tmpInstructions = instructions
    var tmpRF = RF


    //execute issued
    for (var i = 0; i < tmpInstructions.length; i++) {
      //var ins = tmpInstructions[i]
      if ((tmpInstructions[i].issued == true) && !tmpInstructions[i].executionBegin) {
        var station = tmpInstructions[i].rs;
        if (station.startsWith("a")) {
          for (var j = 0; j < tmpRSAdd.length; j++)
            if (tmpRSAdd[j].name == station)
              if (tmpRSAdd[j].vj != "" && tmpRSAdd[j].vk != "") {
                tmpInstructions[i].executionBegin = cycle
                tmpInstructions[i].executionEnd = cycle + addCycles
              }
        }
        if (station.startsWith("m")) {
          for (var j = 0; j < tmpRSMul.length; j++)
            if (tmpRSMul[j].name == station)
              if (tmpRSMul[j].vj != "" && tmpRSMul[j].vk != "") {
                tmpInstructions[i].executionBegin = cycle
                tmpInstructions[i].executionEnd = cycle + mulCycles
              }
        }

        if (station.startsWith("s")) {
          for (var j = 0; j < storeBuffertmp.length; j++)
            if (storeBuffertmp[j].name == station){
              console.log("grap")
              console.log(storeBuffertmp[j])
              if (storeBuffertmp[j].vj != "" && storeBuffertmp[j].vk != "") {
                console.log("STORE READY")
                storeBuffertmp[j].a = parseInt(storeBuffertmp[j].offset,10) + parseInt(storeBuffertmp[j].vj,10)
                console.log(parseInt(storeBuffertmp[j].offset,10))

                tmpInstructions[i].executionBegin = cycle
                tmpInstructions[i].executionEnd = cycle + loadCycles
              }

            }

        }
        if (station.startsWith("l")) {
          for (var j = 0; j < loadBuffertmp.length; j++)
            if (loadBuffertmp[j].name == station)
              if (loadBuffertmp[j].vj != "") {
                console.log(loadBuffertmp[j].offset)

                loadBuffertmp[j].a = parseInt(loadBuffertmp[j].offset, 10) + parseInt(loadBuffertmp[j].vj, 10)
                console.log(Number.parseInt(loadBuffertmp[j].offset,10))
                tmpInstructions[i].executionBegin = cycle
                tmpInstructions[i].executionEnd = cycle + loadCycles
              }
        }
      }
    }
    //check finished

    for (var i = 0; i < tmpInstructions.length; i++) {
      console.log("writing ")
      console.log("cycle > parseInt(tmpInstructions[i].executionEnd) ")
      console.log( cycle > parseInt(tmpInstructions[i].executionEnd))
      console.log(" tmpInstructions[i].executionEnd != empty")
      console.log( tmpInstructions[i].executionEnd != "") 
      console.log(" tmpInstructions[i].write = empty")
      console.log(tmpInstructions[i].writeCycle == "")
      console.log(tmpInstructions[i].op)
      console.log(tmpInstructions[i].writeCycle)
      console.log(cycle)


      if (cycle > parseInt(tmpInstructions[i].executionEnd) && tmpInstructions[i].executionEnd != "" && tmpInstructions[i].writeCycle == "") {
        console.log("writing  if")
        
        console.log(tmpInstructions[i])
        const station = getStation(tmpInstructions[i].rs)
        console.log(station)
        const result = getResult(station.op, station.vj, station.vk, station.a)
        //write in rf, rs

        if(tmpInstructions[i].op!="st")
          regSetData(tmpInstructions[i].destination, result)

        if(tmpInstructions[i].op!="st")
          updateRF(tmpInstructions[i].destination, station.name)

        updateRS(station.name, result)


        //set write cycle 
        tmpInstructions[i].writeCycle = cycle
        emptystation(instructions[i].rs)
        break;

      }
    }
    console.log(memory)

    //issuing instruction
    for (var i = 0; i < tmpInstructions.length; i++) {
      var ins = tmpInstructions[i]
      if (ins.issued == false) {
        //try to issue
        if ((ins.op == "add" || ins.op == "sub") && !isFull(tmpRSAdd)) {
          console.log("ADD IF")
          tmpInstructions[i].issued = true
          tmpInstructions[i].issueCycle = cycle
          for (var j = 0; j < tmpRSAdd.length; j++) {
            if (tmpRSAdd[j].busy == "0") {
              tmpRSAdd[j].op = ins.op
              let regj = RF.find(o => o.name === ins.j);
              let regk = RF.find(o => o.name === ins.k);

              if (regj.qi == "") {
                tmpRSAdd[j].vj = regj.data//what you find in rf value
              }
              else {
                tmpRSAdd[j].qj = regj.qi //what you find in rf qi
              }

              if (regk.qi == "") {
                tmpRSAdd[j].vk = regk.data//what you find in rf value
              }
              else {
                tmpRSAdd[j].qk = regk.qi //what you find in rf qi
              }
              tmpRSAdd[j].busy = "1"
              tmpInstructions[i].rs = tmpRSAdd[j].name
              console.log(tmpInstructions[i].destination)
              console.log(tmpRSAdd[j].name)
              regSet(tmpInstructions[i].destination, tmpRSAdd[j].name)
              break;
            }
          }
        }
        if ((ins.op == "mul" || ins.op == "div") && !isFull(tmpRSMul)) {
          console.log(" MUL")
          tmpInstructions[i].issued = true
          tmpInstructions[i].issueCycle = cycle
          for (var j = 0; j < tmpRSMul.length; j++) {
            if (tmpRSMul[j].busy == "0") {
              tmpRSMul[j].op = ins.op
              let regj = RF.find(o => o.name === ins.j);
              let regk = RF.find(o => o.name === ins.k);
              if (regj.qi == "") {
                tmpRSMul[j].vj = regj.data//what you find in rf value
              }
              else {
                tmpRSMul[j].qj = regj.qi //what you find in rf qi
              }

              if (regk.qi == "") {
                tmpRSMul[j].vk = regk.data//what you find in rf value
              }
              else {
                tmpRSMul[j].qk = regk.qi //what you find in rf qi
              }
              tmpRSMul[j].busy = "1"
              tmpInstructions[i].rs = tmpRSMul[j].name
              regSet(tmpInstructions[i].destination, tmpRSMul[j].name)
              break;
            }
          }
        }
        if ((ins.op == "ld") && !isFull(loadBuffertmp)) {
          console.log(ins)
          tmpInstructions[i].issued = true
          tmpInstructions[i].issueCycle = cycle
          for (var j = 0; j < loadBuffertmp.length; j++) {
            if (loadBuffertmp[j].busy == "0") {
              loadBuffertmp[j].op = ins.op
              let regj = RF.find(o => o.name === ins.j);
              let regk = RF.find(o => o.name === ins.k);
              loadBuffertmp[j].offset = ins.offset
              if (regj.qi == "") {
                loadBuffertmp[j].vj = regj.data//what you find in rf value
              }
              else {
                loadBuffertmp[j].qj = regj.qi //what you find in rf qi
              }
  
              loadBuffertmp[j].busy = "1"
              tmpInstructions[i].rs = loadBuffertmp[j].name
              regSet(tmpInstructions[i].destination, loadBuffertmp[j].name)
              break;
            }
          }
        }
        if ((ins.op == "st") && !isFull(storeBuffertmp)) {
          tmpInstructions[i].issued = true
          tmpInstructions[i].issueCycle = cycle

          for (var j = 0; j < storeBuffertmp.length; j++) {
            if (storeBuffertmp[j].busy == "0") {
              storeBuffertmp[j].op = ins.op
              let regj = RF.find(o => o.name === ins.j);
              let regk = RF.find(o => o.name === ins.k);
              storeBuffertmp[j].offset = ins.offset


              if (regj.qi == "") {
                storeBuffertmp[j].vj = regj.data//what you find in rf value
              }
              else {
                storeBuffertmp[j].qj = regj.qi //what you find in rf qi
              }

              if (regk.qi == "") {
                storeBuffertmp[j].vk = regk.data//what you find in rf value
              }
              else {
                storeBuffertmp[j].qk = regk.qi //what you find in rf qi
              }

              storeBuffertmp[j].busy = "1"
              tmpInstructions[i].rs = storeBuffertmp[j].name

              break;

            }
          }

        }
        break;
      }

    }

    console.log(tmpRSAdd)
    setRSAdd([...tmpRSAdd])
    setRSMul([...tmpRSMul])
    setInstructions([...tmpInstructions])
    setLoadBuffer([...loadBuffertmp])
    setStoreBuffer([...storeBuffertmp])
    var nextCycle = cycle + 1
    console.log(nextCycle)
    setCycle(nextCycle)
    setRF([...tmpRF])

  }

  const header = ["Name", "OP", "Vj", "Vk", "Qj", "Qk", "A", "Busy"]
  function renderAddHeader() {
    return header.map((key) => {
      return <th >{key.toUpperCase()}</th>
    })
  }

  function renderRSAdd() {
    return RSAdd.map((station) => {

      return (
        <tr key={station.name}>
          <td>{station.name}</td>
          <td>{station.op}</td>
          <td>{station.vj}</td>
          <td>{station.vk}</td>
          <td>{station.qj}</td>
          <td>{station.qk}</td>
          <td>{station.a}</td>
          <td>{station.busy}</td>


        </tr>
      )



    })
  }

  function renderRSMul() {
    return RSMul.map((station) => {

      return (
        <tr key={station.name}>
          <td>{station.name}</td>
          <td>{station.op}</td>
          <td>{station.vj}</td>
          <td>{station.vk}</td>
          <td>{station.qj}</td>
          <td>{station.qk}</td>
          <td>{station.a}</td>
          <td>{station.busy}</td>


        </tr>
      )



    })
  }
  const headerRF = ["Name", "Qi", "Data"]
  function renderRFHeader() {
    return headerRF.map((key) => {
      return <th >{key.toUpperCase()}</th>
    })
  }

  function renderRF() {
    return RF.map((station) => {

      return (
        <tr key={station.name}>
          <td>{station.name}</td>
          <td>{station.qi}</td>
          <td>{station.data}</td>



        </tr>
      )
    })
  }

  const headerL = ["Name", "vJ", "Qj", "A", "Offset", "Busy"]
  function renderLHeader() {
    return headerL.map((key) => {
      return <th >{key.toUpperCase()}</th>
    })
  }
  function renderLoad() {
    return loadBuffer.map((station) => {
      return (
        <tr key={station.name}>
          <td>{station.name}</td>
          <td>{station.vj}</td>
          <td>{station.qj}</td>
          <td>{station.a}</td>
          <td>{station.offset}</td>
          <td>{station.busy}</td>
        </tr>
      )
    })
  }
  function rendertom() {
    setNotReady(false)
  
  }

  const headerS = ["Name", "vJ", "vk", "Qj", "Qk", "A", "Offset", "Busy"]
  function renderSHeader() {
    return headerS.map((key) => {
      return <th >{key.toUpperCase()}</th>
    })
  }
  function renderStore() {
    return storeBuffer.map((station) => {
      console.log(station.offset)
      return (
        <tr key={station.name}>
          <td>{station.name}</td>
          <td>{station.vj}</td>
          <td>{station.vk}</td>
          <td>{station.qj}</td>
          <td>{station.qk}</td>
          <td>{station.a}</td>
          <td>{station.offset + " "}</td>
          <td>{station.busy}</td>
        </tr>
      )
    })
  }
  function addInstruction() {
    console.log("offset")
    console.log(  offsetInputRef.current.value      )
    var tmpInstructions = instructions
    if(op=="ld"|| op=="st"){
      
      tmpInstructions.push({
        op:op,
        destination: destination,
        j:j,
        k:k,
        issued:false,
        rs:"",
        issueCycle:"",
        executionBegin:"",
        executionEnd:"",
        writeCycle:"",
        offset: offsetInputRef.current.value
    })
    console.log(tmpInstructions)


    }


    else  
    tmpInstructions.push({
        op:op,
        destination: destination,
        j:j,
        k:k,
        issued:false,
        rs:"",
        issueCycle:"",
        executionBegin:"",
        executionEnd:"",
        writeCycle:""
    })
    setInstructions([...tmpInstructions])
 }


  if (notReady) {
    return (
      <div>
        <div className="wrap-input100 validate-input">
          &emsp;<label for="cars">Op</label>&emsp;
<select className="dropbtn" required="required" onChange={chooseOP}>
<option value="">choose</option>
            <option value="add">Add</option>
            <option  value="sub" >Sub</option>
            <option value="mul" >Mult</option>
            <option  value="div" >Divide</option>
            <option  value="ld" >Load</option>
            <option  value="st" >Store</option>
          </select>
          <span className="focus-input100"></span>
          <span className="symbol-input100">
          </span>
        </div>

        <div className="wrap-input100 validate-input">
          &emsp;<label for="cars">destination $</label>&emsp;
<select className="dropbtn" id="cars" required="required" onChange={chooseDestination}>
<option value="">choose</option>
            <option value="r1">R1</option>
            <option value="r2" >R2</option>
            <option value="r3" >R3</option>
            <option value="r4" >R4</option>
            <option value="r5" >R5</option>
          </select>
        </div>

        <div className="wrap-input100 validate-input">
          &emsp;<label for="cars">Op1 $</label>&emsp;
<select className="dropbtn" id="cars" required="required" onChange={choosej}>
<option value="">choose</option>
            <option value="r1">R1</option>
            <option value="r2" >R2</option>
            <option value="r3" >R3</option>
            <option value="r4" >R4</option>
            <option value="r5" >R5</option>
          </select>
        </div>
        <div className="wrap-input100 validate-input">
          &emsp;<label for="cars">Op2 $</label>&emsp;
<select className="dropbtn" id="cars" required="required" onChange={choosek}>
            <option value="">choose</option>
            <option value="r1">R1</option>
            <option value="r2" >R2</option>
            <option value="r3" >R3</option>
            <option value="r4" >R4</option>
            <option value="r5" >R5</option>
          </select>
        </div>
        <label>Offset (if load or store):</label>
        <input type="number" min="0" max="10" ref={offsetInputRef}></input>  <br/><br/>
        <button className="btn" onClick={addInstruction}> Add Instruction </button> &emsp; &emsp;
        <button  className="btn" onClick={rendertom}> start execution</button>  <br/>
       
      <div>
        <h1 id='title'>Instructions</h1>
          <table id='requests'>
            <tbody>
              <tr>{renderIHeader()}</tr>
              {renderI()}
            </tbody>
          </table>
          </div>

      </div>
    )
  }

  //update register file remove qi

  else
    return (
      <div className="App">
        <button className="btn" onClick={Tomasulo}> Next Cycle </button>
        <h3>{cycle - 1}</h3>
        <div class="limiter">
          <h1 id='title'>Instructions</h1>
          <table id='requests'>
            <tbody>
              <tr>{renderIHeader()}</tr>
              {renderI()}
            </tbody>
          </table>

          <h1 id='title'>Add Station </h1>
          <table id='requests'>
            <tbody>
              <tr>{renderAddHeader()}</tr>
              {renderRSAdd()}
            </tbody>
          </table>

          <h1 id='title'>Multiply Station </h1>
          <table id='requests'>
            <tbody>
              <tr>{renderAddHeader()}</tr>
              {renderRSMul()}
            </tbody>
          </table>

          <h1 id='title'>Load Buffer</h1>
          <table id='requests'>
            <tbody>
              <tr>{renderLHeader()}</tr>
              {renderLoad()}
            </tbody>
          </table>
          <h1 id='title'>Store Buffer</h1>
          <table id='requests'>
            <tbody>
              <tr>{renderSHeader()}</tr>
              {renderStore()}
            </tbody>
          </table>



          <h1 id='title'>Register File</h1>
          <table id='requests'>
            <tbody>
              <tr>{renderRFHeader()}</tr>
              {renderRF()}
            </tbody>
          </table>




        </div>
      </div>
    );

}

export default App;







