import { Model } from './model';

describe('Model', () => {
    
    it("check if the Model class is properly instance",()=>{
        expect(new Model() instanceof Model).toBeTruthy();
    });
    
});