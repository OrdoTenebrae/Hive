import { clientPromise, dbName } from './mongodb'

export interface AIDocument {
  referenceId: string;
  documentType: 'project_insights' | 'task_suggestions' | 'module_data';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
  };
  data: Record<string, any>;
}

export function isStale(updatedAt: Date, staleThreshold: number = 3600000) { // 1 hour default
  return Date.now() - new Date(updatedAt).getTime() > staleThreshold;
}

export class AIDataService {
  private collection = 'ai_data';

  async connect() {
    const client = await clientPromise;
    const db = client.db(dbName);
    return db.collection<AIDocument>(this.collection);
  }

  async saveData(doc: Omit<AIDocument, 'metadata'>) {
    const collection = await this.connect();
    return collection.insertOne({
      ...doc,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    });
  }

  async getData(referenceId: string, documentType: AIDocument['documentType']) {
    const collection = await this.connect();
    return collection.findOne({ referenceId, documentType });
  }

  async updateData(
    referenceId: string, 
    documentType: AIDocument['documentType'],
    data: Record<string, any>
  ) {
    const collection = await this.connect();
    return collection.updateOne(
      { referenceId, documentType },
      { 
        $set: { 
          data,
          'metadata.updatedAt': new Date(),
          'metadata.version': { $inc: 1 }
        }
      }
    );
  }
} 