import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { UserCredentials,dbuser,BatchAnalysisModel,BatchDbModel } from '../Interfaces/Interface';

export class Database {
  private uri: string;
  private dbName: string;
  private client: MongoClient;
  private db: Db | undefined;

  constructor(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
    this.client = new MongoClient(this.uri);
  }

  public connectToDatabase(): void {
    this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log('Connected to database');
  }

  public async verifyUserCredentials(userCredentials: UserCredentials): Promise<boolean | any> {
    if (!this.db) {
      
      throw new Error('Database connection is not established');
    }

    const usersCollection: Collection = this.db.collection('users');
    

    let collection = await usersCollection.find({}).toArray();
    if (collection.length > 0 && Array.isArray(collection[0].users)) 
    { 
      
      const users: dbuser[] = collection[0].users;

      // Extract and log each user's data
      for (const userData of users) {
        const db_username = userData.email;
        const db_password = userData.password;
        if (db_username === userCredentials.Email && db_password === userCredentials.Password) {
          return true;
        }
        
      }
    return false;
      
    } else {
      console.log('No users found in the collection');
    }
  
  }
  public async addReport(batchAnalysis: BatchAnalysisModel): Promise<string | any> {
    if (!this.db) {
        throw new Error('Database connection is not established');
    }
    console.log("Adding report to database now : ");
    const collection: Collection = this.db.collection('reports');

    try {
        // Create a new ObjectId
        const objid = new ObjectId();
        const batchDbModel: BatchDbModel = {
            objectid: objid,  // Use the same ObjectId for objectid

            BatchData: {
                Name: batchAnalysis.BatchData.Name,
                Module: batchAnalysis.BatchData.Module,
                Date: new Date().toISOString(),
                AnalysisModel: batchAnalysis.BatchData.AnalysisModel,
                CandidateStrengthAnalysis: batchAnalysis.BatchData.CandidateStrengthAnalysis,
                insight:batchAnalysis.BatchData.insight
            }
        };

        // Insert the document with explicit _id
        await collection.insertOne({
            _id: objid,  // Set the _id to the created ObjectId
            ...batchDbModel
        });

        console.log('Report added successfully');
        return batchDbModel.objectid.toString();
       
    } catch (error) {
        console.error('Failed to add report', error);
        return "";
    }
}

  
  public async getReportById(reportId: string): Promise<BatchDbModel | null> {
    if (!this.db) {
      throw new Error('Database connection is not established');
    }

    const collection: Collection = this.db.collection('reports');
    try {
      const objectId = new ObjectId(reportId); 
      const report = await collection.findOne({ "objectid": objectId });
      if (report) {
        
        // Transform the retrieved document to BatchDbModel
        const batchDbModel: BatchDbModel = {
          objectid: report._id,
          BatchData: {
            Name: report.BatchData.Name,
            Module: report.BatchData.Module,
            Date: report.BatchData.Date,
            AnalysisModel: report.BatchData.AnalysisModel.map((data: any) => ({
              Name: data.Name,
              Strengths: data.Strengths.map((strength: any) => ({
                Parameter: strength.Parameter,
                Data: strength.Data
              })),
              AreasOfImprovement: data.AreasOfImprovement.map((improvement: any) => ({
                Parameter: improvement.Parameter,
                Data: improvement.Data
              })),
              InputForMentors: data.InputForMentors.map((input: any) => ({
                Parameter: input.Parameter,
                Data: input.Data
              }))
             })),
             CandidateStrengthAnalysis: report.BatchData.CandidateStrengthAnalysis,
             insight:report.BatchData.insight

          }
        };
        return batchDbModel;
      } else {
        console.log('No report found with the given ID');
        return null;
      }
    } catch (error) {
      console.error('Failed to get report', error);
      throw error;
    }
  }

  public async getAllRecords(collectionName: string): Promise<BatchDbModel[]> {
    if (!this.db) {
      throw new Error('Database connection is not established');
    }
  
    const collection: Collection = this.db.collection(collectionName);
    try {
      const records = await collection.find({}).toArray();
        if (records.length > 0) {
        const formattedRecords: BatchDbModel[] = records.map(record => ({ 
          objectid: record._id,
          BatchData: {
            Name: record.BatchData.Name, 
            Module: record.BatchData.Module, 
            Date: record.BatchData.Date,
            AnalysisModel: record.BatchData.AnalysisModel.map((data: any) => ({
              Name: data.Name,
              Strengths: data.Strengths.map((strength: any) => ({
                Parameter: strength.Parameter,
                Data: strength.Data
              })),
              AreasOfImprovement: data.AreasOfImprovement.map((improvement: any) => ({
                Parameter: improvement.Parameter,
                Data: improvement.Data
              })),
              InputForMentors: data.InputForMentors.map((input: any) => ({
                Parameter: input.Parameter,
                Data: input.Data
              }))
            })),
            CandidateStrengthAnalysis: record.BatchData.CandidateStrengthAnalysis,
            insight:record.BatchData.insight
         
          }
        }));
        console.log(`Fetched ${records.length} records from ${collectionName} collection`);
        return formattedRecords;
      } else {
        console.log('No records found');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch records', error);
      throw error;
    }
  }
  

  
  public  deleteReportById(reportId: string): any {
    if (!this.db) {
      throw new Error('Database connection is not established');
    }
    const collection: Collection = this.db.collection('reports');
    try {
      const objectId = new ObjectId(reportId); 
      const report =  collection.deleteOne({ _id: objectId }); 
      if (report) {
        console.log('Report Deleted :', report);
        return report;
      } else {
        console.log('No report found with the given ID');
        return null;
      }
    } catch (error) {
      console.error('Failed to get report', error);
      throw error;
    }
  }

}

  



