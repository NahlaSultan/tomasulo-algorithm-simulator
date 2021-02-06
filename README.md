# tomasulo-algorithm-simulator
Simulating the famous tomasulo algorithm and taking a look at what happens in each register every clock cycle with a simple, intuitive UI



We implemented our project using javascript and react js. 

**To run the project: open the folder in vscode and open up a new terminal.**

**Run the following commands**

```sh
cd app

npm install

npm start
```


# 1.Models

Each hardware component is simulated by an array of objects with the following attributes



1. Instruction Array:	


```
instructions.push({
 op: //opcode ,
 destination: //destination reg ,
 j: //source register 1 ,
 k: //source register 2 ,
 issued: //boolean to indicate whether or not the instruction is issued (false initially) ,
 rs: //the name of the reservation station assigned to the instruction (this variable is set after we issuing),
 issueCycle: //cycle in which the instruction is issued,
 executionBegin: //cycle in which the instruction started execution,
 executionEnd: //cycle in which the instruction ended execution,
 writingCycle: //cycle in which the instruction wrote to the bus,
 offset: //offset in case the instruction is a load or store
})

```



2. Register File:

	


```
//register file sample
RF[0] =
 {
   name: "r1", //name of the register
   qi: "", //qi is initially "" (representing 0) for all registers
   data: "" //the data in the register
 }

```



3. Addition/Subtraction Reservation Station:

//


```
 //addition and subtraction reservation station sample
RSAdd[0]=
   {
     op: "", //opcode
     name: "a1", //name of RS
     vj: "",
     vk: "",
     qj: "",
     qk: "",
     a: "", //address
     busy: 0 //busy flag (initially 0)
   }

```



4. Multiplication/Division Reservation Station:

//


```
 //multiplication and division reservation station sample
RSMul[0]=
   {
     op: "", //opcode
     name: "a1", //name of RS
     vj: "",
     vk: "",
     qj: "",
     qk: "",
     a: "", //address
     busy: 0 //busy flag (initially 0)
   }

```



5. Load and store buffers:


```
 //example:  l.d  $t2, 4($t1)
 loadBuffer[0]=
   {
     name: "l1", //name of RS
     vj: "", //represents contents of register $t1
     vk: "",
     qj: "", //in case $t1 is not ready
     qk: "",
     a: "", //address (calculated from offset + vj )
     offset: "", //4
     busy: 0
   }


   //example:  s.d $f0, 100($t2) s
   storeBuffer[0]=
   {
     name: "l1", //name of RS
     vj: "", //represents contents of register $t2
     vk: "", //represents contents of register $f0
     qj: "", //a reservation station name in case $t2 is not ready
     qk: "", //a reservation station name in case $$f0 is not ready
     a: "", //address (calculated from offset + vj )
     offset: "", //100
     busy: 0
   }

```



6. Memory

An array of size 100 that is initially all set to 0’s


# 2. Functionality


## Taking mips instructions as input from the user:

We do so in the UI by having dropdown menus where the user can select an operation, 2 source registers, a destination register, and an offset if needed. We then push the data in the instruction array and display it in the instructions table

When the user enters all the desired instructions, he can simply click the “start execution” button to begin.

The following happens each cycles


## Issuing: 

We traverse the array of instructions and issue the first one we can, meaning the first instruction with room for it in its corresponding reservation station (no structural hazards) and perform the following updates:

-update the destination register’s “qi” attribute in the register file

-fill out the reservation station with the instruction’s data. If the corrosping source register in the register file has qi =“” we copy the data from the register file to the vj/qj field, otherwise we copy the value of qi to the vk/qk field. And we set busy to 1 .

-update the issued flag in the instruction to true, and the instruction cycle to the current cycle


## Execution: 

Pass by all reservation stations, if both vj and qj are available we start execution and set the executionBegin attribute in the instruction to the current cycle. We also set the executionEnd attribute to the current cycle + a certain number of cycles depending on the operation


## Writing back: 

We get the result of the arithmetic operation (works for floating point numbers) or perform the load or store to and from the memory array.   

We then check all reservation stations to see if any vk/qk field needs the result by seeing if the value is equal to the reservation station’s name. 

We update the register file by setting qi back to an empty string “”, if and only if the qi is equal to 

the reservation station’s name (meaning no next issued instruction will write to this register) to prevent hazards. 


### Video demo: https://drive.google.com/file/d/1GgZ7wZ4WED4e_vi81PnM52MShpjQgyNc/view

## Contributors

👤 **Nahla Sultan, Youssef Hedaya, Omar Eissa**

* Github: [@nahla.sultan](https://github.com/nahla.sultan)
