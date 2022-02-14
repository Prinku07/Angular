import { Options } from '@angular-slider/ngx-slider';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private route:ActivatedRoute,private http:HttpClient,private dom:DomSanitizer,private formbuilder:FormBuilder) { }

  userId:any;
  userData:any;
  imgSrc:any;
  ImageBaseString:any
  registrationFrom:any;

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

  State(){
    return [
      {   id: 1,  name: "Gujarat" }, {  id: 1, name: "Maharashtra", },  {id: 1, name: "Goa" },
      { id: 2, name: "New york" }, { id: 2,  name:"Las Vegas"}, { id: 2, name:  "Washington" },
      { id: 3, name: "London" }, { id: 3,  name :"England"}, { id: 3, name: " France" }
    ]
  }
  Contries: any= [];
  state: any = [];


onSelect(Contries : any){

  this.state = this.State()
    .filter(e=>
      e.id == Contries.target.value);
    }

  selectedAddress: any;

      Address : any = [
          {  name: 'Home',  Add: [ {cname: 'Address1'},{cname: 'Address2'}  ] },
          { name: 'Company', Add: [{cname: 'Company Address1'}, {cname: 'Company Address2'}]  }
        ];
  ngOnInit(): void {

    this.route.queryParamMap.subscribe(res=>{
     // console.log(res);
      let data:any = res;
     this.userId = data.params.id;
    });
    this.getUserData();

    this.registrationFrom = this.formbuilder.group({
      Image:['',Validators.required, ],
      FirstName:['',Validators.required,Validators.pattern('^[a-zA-Z]{10}$'), Validators.maxLength(20)],
      LastName:['',Validators.required],
      Email:['',Validators.required],
      Phone:['',Validators.required],
      Age:['',Validators.required],
      State:['',Validators.required],
      Country:['',Validators.required],
      tags:['',Validators.required],
      address:['',Validators.required],
      Subscribe:['',Validators.required]
    })
  }

  getUserData(){
    this.http.get("http://localhost:3000/posts/"+this.userId).subscribe(res=>{
      this.userData = res;
      //this.dom.bypassSecurityTrustUrl(this.userData.Image);
      this.dom.bypassSecurityTrustResourceUrl(this.userData.Image)
      console.log(this.userData.Image)
      this.ImageBaseString = this.userData.Image
    })
  }



  showPreview(event : any) {
    if(event.target.files && event.target.files[0])
    {
 // File Preview
   const reader = new FileReader();
    reader.onload = (e : any) =>
      this.userData.Image = e.target.result;
        reader.readAsDataURL(event.target.files[0]);


        reader.onloadend = ()=>{
          this.ImageBaseString = reader.result;

        }

 }
 else {
   this.imgSrc = '/assets/Placeholder.png';

 }
}


openModal(){

this.registrationFrom.patchValue({
Age: this.userData.Age,
Country: this.userData.Country,
Email: this.userData.Email,
FirstName:this.userData.FirstName,
LastName: this.userData.LastName,
Phone:this.userData.Phone,
State:this.userData.State,
Subscribe:this.userData.Subscribe,
tags:this.userData.tags,
address : this.userData.address
   })
   $('#exampleModalCenter').modal('show');
 }

 closeModal(){
   $('#exampleModalCenter').modal('hide');
 }


 formSubmit(){
   console.log(this.registrationFrom.value)
   this.registrationFrom.value.Image= this.ImageBaseString
   let formData = this.registrationFrom.value;
   this.http.put("http://localhost:3000/posts/"+this.userId,formData).subscribe(res=>{
     console.log(res);
     this.userData = res
   })
   $('#exampleModalCenter').modal('hide');
 }
}
