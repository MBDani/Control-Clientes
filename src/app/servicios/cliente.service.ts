import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Cliente } from "../modelo/cliente.model";
import {map} from 'rxjs/operators'

@Injectable()
export class ClienteServicio{
    clientesCollection: AngularFirestoreCollection<Cliente>; //cliente es el modelo que contendrá la misma información que la de nuestra colección en la base de datos.
    clienteDoc: AngularFirestoreDocument<Cliente>; //para saber en que documento nos encontramos

    //Hacemos listener/Observable de lo que nos puedan devolver
    clientes: Observable<Cliente[]>;
    cliente: Observable<Cliente>;

    //Inyectamos el servicio de conexión a Firebase
    constructor(private db: AngularFirestore){
        //El segundo parámetro del paréntesis es un método para que nos lo devuelva ordenado por nombre. Todo esto se encuentra dentro de un forEach
        this.clientesCollection = db.collection('clientes', ref => ref.orderBy('nombre', 'asc'));
    }

    getClientes(): Observable<Cliente[]>{
        //Obtenemos los clientes: 
            //snapshotChanges() devuelve la colección de clientes
            //pipe() para iterar cada uno de los elementos
        this.clientes = this.clientesCollection.snapshotChanges().pipe(
            map(cambios => {
                return cambios.map( accion =>{
                    const datos = accion.payload.doc.data() as Cliente;
                    datos.id = accion.payload.doc.id;
                    return datos;
                })
            })
        );
        return this.clientes;
    }

    agregarCliente(cliente: Cliente) {
        this.clientesCollection.add(cliente);
        
      }

      getCliente(id: string){
        this.clienteDoc = this.db.doc<Cliente>(`clientes/${id}`); //recueramos el documentos gracias a la URL que le estamos aportando
        this.cliente = this.clienteDoc.snapshotChanges().pipe(
            map( accion => {
                if (accion.payload.exists == false){ //comprobamos si hay información en este elemento
                    return null;
                }else{ //si hay información recuperamos el elemento
                    const datos = accion.payload.data() as Cliente; //cargamos los datos definiéndolos como clientes
                    datos.id = accion.payload.id;
                    return datos;
                }
            })
        );
        return this.cliente;
      }


      modificarCliente(cliente:Cliente){
          this.clienteDoc = this.db.doc(`clientes/${cliente.id}`);
          this.clienteDoc.update(cliente);
      }

      eliminarCliente(cliente:Cliente){
          this.clienteDoc = this.db.doc(`clientes/${cliente.id}`);
          this.clienteDoc.delete();
      }


}