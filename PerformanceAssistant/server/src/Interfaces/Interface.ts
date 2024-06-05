import { ObjectId } from 'mongodb';

//Login credentials
export interface UserCredentials {
    Email: string;
    Password: string;
  }

//Db user Credentials
  export interface dbuser {
    email: string;
    password: string;
  }

//Database model
export interface BatchDbModel {
  objectid : ObjectId;
  BatchData: {
      Name:string;
      Module: string;
      Date:string;
      AnalysisModel: CandidateAnalysisModel[];
      CandidateStrengthAnalysis: CandidateStrengthAnalysis;
      insight: InsightModel;

  }
}

//Analysis Mode is the output from OpenAI
export interface CandidateAnalysisModel {
  Name: string;
  Strengths: { Parameter: string, Data: string }[];
  AreasOfImprovement: { Parameter: string, Data: string }[];
  InputForMentors: { Parameter: string, Data: string }[];
}
 
 
export interface BatchAnalysisModel {
  BatchData: {
    Name: string;
    Module: string;
    AnalysisModel: CandidateAnalysisModel[];
    CandidateStrengthAnalysis: CandidateStrengthAnalysis;
    insight: InsightModel;
   
  }
}



// DataModel is the input for analysis 
export interface CandidateDataModel {
  Name: string;
  Data: { Parameter: string; Data: string }[];
}
 
export interface BatchDataModel {
  Name: string;
  Module: string;
  Data: CandidateDataModel[];
}
//Store strengths 
export interface StrengthAnalysisModel {
  Name: string;
  Strengths: { Parameter: string, Data: string }[];
}


export interface CandidateStrengthAnalysis{
 Data : { Name : string , Strength : number}[]
}



  export interface InsightModel{
    
    Data : [
      {
      Name : string,
      CombineStrength:number,
      suggestedRole:string[],
      insight:[
        {
          parameter: string;
          strength: number;
        },
      ]
  },
  ]
  }

