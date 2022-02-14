import { Options } from '@angular-slider/ngx-slider';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationFrom:any;
  imgSrc : any="/assets/Placeholder.png";
  selectedImage : any;
  ImageBaseString:any;

  options: Options = {
    floor: 0,
    ceil: 50
  };

  country(){
    return [
      { id: 1,  name: "India"  },
      {id: 2, name: "USA"},
      {id: 3, name: "UK"}
    ]
  }

  Statee(){
    return [
      {  id: 1,  name: "Gujarat" }, {  id: 1, name: "Maharashtra", },  {id: 1, name: "Goa" },
      { id: 2, name: "New york" }, { id: 2,  name:"Las Vegas"}, { id: 2, name:  "Washington" },
      { id: 3, name: "London" }, { id: 3,  name :"England"}, { id: 3, name: " France" }
    ]
  }
  Contries: any= [];
  state: any = [];


onSelect(Contries : any){

  this.state = this.Statee()
    .filter(e=>
      e.id == Contries.target.value);
    }

  selectedAddress: any;

      Address : any = [
          {  name: 'Home',  Add: [ {cname: 'Address1'},{cname: 'Address2'}  ] },
          { name: 'Company', Add: [{cname: 'Company Address1'}, {cname: 'Company Address2'}]  }
        ];

  constructor(private formbuilder:FormBuilder,private http:HttpClient,private route:Router) { }



  ngOnInit(): void {

  this.Contries = this.country();

    this.registrationFrom = this.formbuilder.group({
      Image:['',Validators.required],
      FirstName:['',[Validators.required,Validators.pattern('^[a-zA-Z]{2,15}'), Validators.maxLength(20)]],
      LastName:['',Validators.required],
      Email:['',[Validators.required, Validators.email]],
      Phone:['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      Age:['',Validators.required],
      State:['',Validators.required],
      Country:['',Validators.required],
      tags:['',Validators.required],
      address:['',Validators.required],
      Subscribe:['',Validators.required]
    })
  }


  openModal(){

   // this.registrationFrom.reset()
    $('#exampleModalCenter').modal('show');
  }

  closeModal(){
    $('#exampleModalCenter').modal('hide');
  }


  formSubmit(){
    this.registrationFrom.value.Image= this.ImageBaseString
    console.log(this.registrationFrom.value)
    let formData = this.registrationFrom.value;
    this.http.post("http://localhost:3000/posts",formData).subscribe(res=>{
      console.log(res);
      let data:any = res;

      $('#exampleModalCenter').modal('hide');
      this.route.navigate(['/profile'],{queryParams:{id:data.id}})

    })
  }

  showPreview(event : any) {
    if(event.target.files && event.target.files[0])
    {
 // File Preview
   const reader = new FileReader();
    reader.onload = (e : any) =>
      this.imgSrc = e.target.result;
        reader.readAsDataURL(event.target.files[0]);
        this.selectedImage = event.target.files[0];

        reader.onloadend = ()=>{
          this.ImageBaseString = reader.result;

        }

 }
 else {
   this.imgSrc = '/assets/Placeholder.png';
   this.selectedImage = null;
 }
}

}
