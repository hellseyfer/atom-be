import { db } from '../../../config/firebase.config';
import { 
  addDoc, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  orderBy, 
  query, 
  runTransaction, 
  where,
  serverTimestamp
} from 'firebase/firestore/lite';
import { ITask } from '../interfaces/task.interface';

class TaskService {
  private taskRef = collection(db, 'tasks');

  async createTask(taskData: Omit<ITask, 'id' | 'createdAt' | 'completed'>): Promise<ITask> {
    try {
      const task: Omit<ITask, 'id'> = {
        ...taskData,
        createdAt: new Date(),
        completed: false,
        updatedAt: new Date()
      };

      const docRef = await addDoc(this.taskRef, task);
      return { id: docRef.id, ...task };
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async getTasksByUser(userId: string): Promise<ITask[]> {
    try {
      const q = query(this.taskRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to Date objects
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as ITask));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw new Error('Failed to get tasks');
    }
  }

  // Alias for getTasksByUser to maintain backward compatibility
  async getUserTasks(userId: string): Promise<ITask[]> {
    return this.getTasksByUser(userId);
  }

  async getTaskById(taskId: string, userId: string): Promise<ITask | null> {
    try {
      const taskDoc = await getDoc(doc(this.taskRef, taskId));
      
      if (!taskDoc.exists()) {
        return null;
      }
      
      const taskData = taskDoc.data();
      
      // Ensure the task belongs to the user
      if (taskData.userId !== userId) {
        return null;
      }
      
      return {
        id: taskDoc.id,
        ...taskData,
        // Convert Firestore timestamps to Date objects
        createdAt: taskData.createdAt?.toDate(),
        updatedAt: taskData.updatedAt?.toDate()
      } as ITask;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw new Error('Failed to fetch task');
    }
  }

  async updateTask(
    taskId: string, 
    userId: string, 
    updateData: Partial<Omit<ITask, 'id' | 'userId' | 'createdAt'>>
  ): Promise<ITask | null> {
    const taskRef = doc(this.taskRef, taskId);
    
    try {
      return await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists()) {
          return null;
        }
        
        const taskData = taskDoc.data();
        
        // Ensure the task belongs to the user
        if (taskData.userId !== userId) {
          return null;
        }
        
        const updatedData = {
          ...updateData,
          updatedAt: serverTimestamp()
        };
        
        await transaction.update(taskRef, updatedData);
        
        return {
          id: taskDoc.id,
          ...taskData,
          ...updateData,
          createdAt: taskData.createdAt?.toDate(),
          updatedAt: new Date()
        } as ITask;
      });
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const taskRef = doc(this.taskRef, taskId);
    
    try {
      return await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists()) {
          return false;
        }
        
        const taskData = taskDoc.data();
        
        // Ensure the task belongs to the user
        if (taskData.userId !== userId) {
          return false;
        }
        
        await transaction.delete(taskRef);
        return true;
      });
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw new Error('Failed to delete task');
    }
  }
}

export const taskService = new TaskService();
