import Quagga from 'quagga';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IMedication } from './models/medication.model';
import { MatDialog } from '@angular/material/dialog';
import { WithdrawDialogComponent } from './components/withdraw-dialog/withdraw-dialog.component';
import { BarcodeDialogComponent } from './components/barcode-dialog/barcode-dialog.component';
import { BrowserMultiFormatReader } from '@zxing/browser';

@Component({
  selector: 'app-medication-stock',
  imports: [
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './medication-stock.component.html',
  styleUrl: './medication-stock.component.scss',
})
export class MedicationStockComponent implements OnDestroy {
  filtro: string = '';
  dadosOriginais: IMedication[] = [
    {
      nome: 'Carprofen',
      codigoBarras: '12345678901',
      lote: 'A12345',
      validade: new Date('2024-08-15'),
      fornecedor: 'VetPharm',
      quantidade: 25,
    },
    {
      nome: 'Amoxicillin',
      codigoBarras: '12345678901',
      lote: 'B23456',
      validade: new Date('2023-12-20'),
      fornecedor: 'AnimalMed',
      quantidade: 50,
    },
    {
      nome: 'Meloxicam',
      codigoBarras: '12345678904',
      lote: 'C34567',
      validade: new Date('2024-05-10'),
      fornecedor: 'PetHealth',
      quantidade: 40,
    },
    {
      nome: 'Enrofloxacin',
      codigoBarras: '12345678905',
      lote: 'D45678',
      validade: new Date('2023-07-25'),
      fornecedor: 'Veterinarly Supplies',
      quantidade: 30,
    },
    {
      nome: 'Cefovecin',
      codigoBarras: '12345678906',
      lote: 'E56789',
      validade: new Date('2024-09-30'),
      fornecedor: 'MediVet',
      quantidade: 20,
    },
    {
      nome: 'Maropitant',
      codigoBarras: '12345678907',
      lote: 'F67890',
      validade: new Date('2024-03-05'),
      fornecedor: 'Petz',
      quantidade: 15,
    },
  ];
  dadosFiltrados = new MatTableDataSource(this.dadosOriginais);
  colunas: string[] = [
    'nome',
    'codigoBarras',
    'lote',
    'validade',
    'fornecedor',
    'quantidade',
    'acoes',
  ];

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  codeResult: string = '';
  private codeReader = new BrowserMultiFormatReader();
  cameraStatus: boolean = false;
  constructor(private dialog: MatDialog) {}

  scannedCode: string | null = null;

  teste(): void {
    this.codeReader
      .decodeFromVideoDevice(
        undefined,
        this.videoElement.nativeElement,
        (result: any, error: any) => {
          if (result) {
            this.codeResult = result.getText();
          }
        }
      )
      .catch((err) => console.error('Erro ao acessar câmera:', err));
  }
  filtrar() {
    const filtroLower = this.filtro.toLowerCase();
    this.dadosFiltrados.data = this.dadosOriginais.filter(
      (med) =>
        med.nome.toLowerCase().includes(filtroLower) ||
        med.codigoBarras.includes(filtroLower)
    );
  }

  abrirFormulario() {
    // lógica para abrir modal de cadastro de medicação
  }

  editar(med: IMedication) {
    // lógica para editar medicação
  }

  retirar(med: IMedication) {
    this.dialog.open(WithdrawDialogComponent, {
      data: med,
    });
  }

  abrirLeitorCamera() {
    // this.setup().initReader();
    // this.dialog.open(BarcodeDialogComponent, {});
    this.teste();
  }

  setup() {
    this.cameraStatus = false;
    const initReader = () => {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#barcode-scanner'), // elemento onde o vídeo será renderizado
          },
          decoder: {
            readers: ['ean_reader'], // escolha os tipos de códigos que você quer ler
          },
        },
        (err: any) => {
          if (err) {
            console.error(err);
            return;
          }
          Quagga.start();

          Quagga.onDetected((result: any) => {
            onDetected(result);
          });
        }
      );
    };

    const stopReader = () => {
      Quagga.stop();
      this.cameraStatus = true;
    };

    const onDetected = (data: any) => {
      alert(data.codeResult.code);

      this.scannedCode = data.codeResult.code;
      console.log('Código detectado:', data.codeResult.code);
      // stopReader()
    };

    return {
      initReader,
      stopReader,
    };
  }

  ngOnDestroy(): void {
    Quagga.stop();
    Quagga.offDetected(() => {});
  }
}
