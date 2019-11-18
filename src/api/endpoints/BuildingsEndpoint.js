import BaseEndpoint from '../common';

export default class BuildingsEndpoint extends BaseEndpoint {

  route = 'buildings/';

  /**
   *
   * @param {AxiosInstance} api
   */
  constructor(api) {
    super(api);
  }

  /**
   *
   * @param id
   * @return {Promise<null|Location[]>}
   */
  async getLocations(id) {
    const response = await this.api.get(this.route + id + '/floors');
    if (response.status === 200) {
      return /**@type {Location[]} */response.data;
    } else {
      return null;
    }
  }

  /**
   *
   * @param locationId
   * @return {Promise<null|Transition>}
   */
  async getTransitions(locationId) {
    const response = await this.api.get(this.route + locationId + '/transitions');
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }

  /**
   *
   * @param buildingId
   * @param floor
   * @return {Promise<null|Location>}
   */
  async getFloor(buildingId, floor) {
    const response = await this.api.get(this.route + buildingId + '/floors/' + floor);
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }
}
