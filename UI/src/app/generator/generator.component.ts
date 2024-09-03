import { Component, OnInit } from '@angular/core';
import { Format } from '../../models/Format';
// import { Route } from '@angular/router';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent implements OnInit{


  formats: Format[]=[
    {
      'id':1,
      'value':'Paragraph'
    },
    {
      'id':2,
      'value':'Bullets'
    }
  ]

  constructor(private router: Router){}

  ngOnInit(): void {}

}
