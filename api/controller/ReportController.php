<?php

require_once("api/lib/fpdf.php");
require_once("api/model/InvoiceModel.php");

class InvoiceReport extends FPDF {
  
    // Page header
    function Header() {
          
        // Add logo to page
        //$this->Image('api.png',10,8,33);
          
        // Set font family to Arial bold 
        $this->SetFont('Arial','B',20);
          
        // Move to the right
        $this->Cell(70);
          
        // Header
        $this->Cell(60,10,'Invoice Report',1,0,'C');
          
        // Line break
        $this->Ln(20);
    }
  
    // Page footer
    function Footer() {
          
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
          
        // Arial italic 8
        $this->SetFont('Arial','I',8);
          
        // Page number
        $this->Cell(0,10,'Page ' . 
            $this->PageNo() . '/{nb}',0,0,'C');
    }
}
  

class ReportController {

    public static function invoice($id) {
        ob_end_clean();

        $pdf = new InvoiceReport();
        $invoice = InvoiceModel::get($id);
        if (!$invoice) {
            Response::error404(); // record not found
            return;
        }

        $invoice_date = new DateTime($invoice['date']);
        
        $pdf->AliasNbPages();
        $pdf->AddPage();
        $pdf->SetFont('Times','',14);
        
        $pdf->Cell(0, 10, 'Amount: '.$invoice['amount'].'e', 0, 1);
        $pdf->Cell(0, 10, 'Group: '.$invoice['group_name'], 0, 1);
        $pdf->Cell(0, 10, 'Store: '.$invoice['store_name'], 0, 1);
        $pdf->Cell(0, 10, 'User: '.$invoice['fullname'].' ('.$invoice['email'].')', 0, 1);
        $pdf->Cell(0, 10, 'Date Created: '.$invoice_date->format("d.m.Y"), 0, 1);
        $pdf->Cell(0, 10, 'Notes: '.$invoice['notes'], 0, 1);

        $pdf->Output();
    }
    
}