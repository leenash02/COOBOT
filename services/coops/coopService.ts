import http from '../httpService';
import CoopInsight from './dto/coopInsight';

class CoopService {

  public async getJobInsights(jobId: number): Promise<CoopInsight> {
    let result = await http.get('api/services/app/Coop/GetJobPI', { params: { jobId: jobId } });
    return result.data.result;
  }

}

export default new CoopService();
