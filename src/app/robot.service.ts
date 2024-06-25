import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gemini } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RobotService {

  constructor() { }
  genAI = new GoogleGenerativeAI(gemini.API_KEY);

  async  get_response(prompt : string) : Promise<string>{
    
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);    
    return result.response.text();
    
  }

  
  
}
