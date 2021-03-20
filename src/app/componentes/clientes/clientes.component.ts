import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Cliente } from 'src/app/modelo/cliente.model';
import { ClienteServicio } from 'src/app/servicios/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  cliente:Cliente = {
    nombre: '',
    apellido: '',
    saldo: 0
  }

  @ViewChild("clienteForm") clienteForm:NgForm; //este nombre lo hemos definido al inicio de nuestro formulario
  @ViewChild ("botonCerrar") botonCerrar:ElementRef
  constructor(private clientesServicio: ClienteServicio,
    private flashMessages:FlashMessagesService) { }

  ngOnInit(): void {
    this.clientesServicio.getClientes().subscribe(
      clientes => {
        this.clientes = clientes;
      }
    )
  }

  getSaldoTotal(){
    let saldoTotal:number = 0;
    if (this.clientes){ //vemos si es distinto de null
      this.clientes.forEach(cliente =>{
        saldoTotal += cliente.saldo;
      })
    }
    return saldoTotal;
  }

  agregar({value, valid}: {value:Cliente, valid: boolean}){
    if (!valid){
      this.flashMessages.show('Por favor rellena el formulario correctamente', { //usamos la variable del constructor de flashMessages
        cssClass: 'alert-danger', timeout:4000 //4 segundos
      });
    }
    else{
      //Agregar el nuevo cliente
      this.clientesServicio.agregarCliente(value);
      this.clienteForm.resetForm();
      this.cerrarModal();
    }
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click(); //para poder acceder al elementos HTML
  }

}
