<?php

class rep extends CI_Model{

    function __construct(){
    	
        parent::__construct();

		$this->load->model('country');
		$this->load->model('location');
    }

	function all(){

		$json = new stdClass();

		//get countries and locations
		$countries = $this->country->all();
		$locations = $this->location->all();

		//store on json object
		if( $countries ) $json->countries = $countries;
		if( $locations ) $json->locations = $locations;

		//get reps
		$query = $this->db->get('rep');

		//if results
		if( $query->num_rows() > 0 ){

			$result = $query->result();

			foreach($result as &$r){

				if( !is_null($r->groups) ){

					$r->groups = explode('*', $r->groups );
				}
			}

			$json->reps = $result;
		}

		return $json;
	}

	function save(){

		$post = $this->input->post(NULL, TRUE);

		//if no country id, save new country, retrieve id
		if( !$post['country_id'] ){

			//prepare data
			$data = array(

				'short_name' => $post['country_short_name'],
				'long_name'  => $post['country_long_name'],
				'lat'        => $post['country_lat'],
				'lng'        => $post['country_lng'],
			);

			//save
			$country_id = $this->country->save($data);
		}
		else{

			$country_id = $post['country_id'];
		}

		//check if we have location
		if( $post['location'] == 'true' ){

			//if no location id, save new location, retrieve id
			if( !$post['location_id'] ){

				//prepare data
				$data = array(

					'country_id' => $country_id,
					'short_name' => $post['location_short_name'],
					'long_name'  => $post['location_long_name'],
					'lat'        => $post['location_lat'],
					'lng'        => $post['location_lng'],
				);

				//save
				$location_id = $this->location->save($data);
			}
			else{

				$location_id = $post['location_id'];
			}
		}
		else{ //no location

			$location_id = NULL;
		}

		$data = array(

			'location_id' => $location_id,
			'country_id'  => $country_id,
			'name'        => $post['name'],
			'address'     => $post['address'],
			'city'        => $post['city'],
			'state'       => $post['state'],
			'zip'         => $post['zip'],
			'company'     => $post['company'],
			'phone'       => $post['phone'],
			'cell'        => $post['cell'],
			'fax'         => $post['fax'],
			'email'       => $post['email'],
			'web'         => $post['web'],
			'lat'         => $post['lat'],
			'lng'         => $post['lng']
		);

		//if groups, implode, add to data array
		if( $this->input->post('groups_save') ){

			if( $post['groups'] ){

				$data['groups'] = implode( '*', $post['groups'] );
			}
			else{

				$data['groups'] = NULL;
			}
		}

		$this->db->insert('rep', $data);

		$post['id'] = $this->db->insert_id();

		return $post;
	}

	function update($id){

		$post = $this->input->post(NULL, TRUE);

		$data = array(

			'name'    => $post['name'],
			'address' => $post['address'],
			'city'    => $post['city'],
			'state'   => $post['state'],
			'zip'     => $post['zip'],
			'company' => $post['company'],
			'phone'   => $post['phone'],
			'cell'    => $post['cell'],
			'fax'     => $post['fax'],
			'email'   => $post['email'],
			'web'     => $post['web'],
			'lat'     => $post['lat'],
			'lng'     => $post['lng']
		);

		//if groups, implode, add to data array
		if( $this->input->post('groups_save') ){

			if( $post['groups'] ){

				$data['groups'] = implode( '*', $post['groups'] );
			}
			else{

				$data['groups'] = NULL;
			}
		}

		$this->db->where('id', $id);
		$this->db->update('rep', $data);

		return $post;
	}

	function delete($id){

		//get location id
		$location_id = $this->get_location_id($id);
		$country_id  = $this->get_country_id($id);

		//delete rep
		$this->db->where('id', $id);
		$this->db->delete('rep');

		//if we have location
		if($location_id){

			//count remaining reps
			$reps_count = $this->reps_remaining($location_id, 'location_id');

			//if no more reps
			if($reps_count == 0){

				//delete location
				$this->location->delete($location_id);

				//count remaining locations
				$locations_count = $this->location->locations_remaining($country_id);

				//if no more locations
				if($locations_count == 0){

					//delete country
					$this->country->delete($country_id);
				}
			}
		}
		else{

			//count remaining reps
			$reps_count = $this->reps_remaining($country_id, 'country_id');

			//if no more reps
			if($reps_count == 0){

				//delete country
				$this->country->delete($country_id);
			}
		}
	}

	function get_location_id($id){

		$this->db->select('location_id');
		$this->db->from('rep');
		$this->db->where('id', $id);

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			return $query->row()->location_id;
		}
		else{

			return false;
		}
	}

	function get_country_id($id){

		$this->db->select('country_id');
		$this->db->from('rep');
		$this->db->where('id', $id);

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			return $query->row()->country_id;
		}
		else{

			return false;
		}
	}

	function reps_remaining($id, $where){

		$this->db->select('id');
		$this->db->from('rep');
		$this->db->where($where, $id);

		$query = $this->db->get();

		return $query->num_rows();
	}
}