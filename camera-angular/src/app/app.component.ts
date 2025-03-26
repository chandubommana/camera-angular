import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WebcamModule} from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,WebcamModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedFile: File | null = null;
  showImage:string|null='';
  stream:any|null=null;
  status:string='';
  private trigger:Subject<void>=new Subject();
  onFileChange(event: Event): void {
  
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; 
      console.log(this.selectedFile.name)
      // this.userForm.patchValue({ Image:this.selectedFile });
      
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.showImage = e.target.result;
        
    
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.showImage = null; 
    }
  }
  
  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }
  checkPermissions(){
    navigator.mediaDevices.getUserMedia({
      video:{
        width:200,
        height:200
      }
    }).then((res)=>{
      console.log("response",res)
      this.stream=res;
    }).catch(err=>{
      console.log(err)
      this.status=err
    })
  }

  convertDataUrlToFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(','); 
    console.log(arr)
    const mimeType = arr[0].match(/:(.*?);/)![1];
    console.log(mimeType)  
    const byteString = atob(arr[1]); 
    
    const byteNumbers = new Uint8Array(byteString.length);
  
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
   console.log(new File([byteNumbers], fileName, { type: mimeType }))
    return new File([byteNumbers], fileName, { type: mimeType });
  }
  
  snapshot(event: any) {
    const file = this.convertDataUrlToFile(event.imageAsDataUrl, "captured-image.png");
    const input =event.target as HTMLInputElement
    console.log(input)
  
    this.selectedFile = file; 
   
    if (this.selectedFile) {
      
      
      console.log(this.selectedFile);
    }
  
    const reader = new FileReader();

      reader.onload = (e: any) => {
        this.showImage = e.target.result;
        
    
      };
      reader.readAsDataURL(this.selectedFile);
  }
  
  

  captureImage(){
    this.trigger.next()
  }
 
 
 

}
