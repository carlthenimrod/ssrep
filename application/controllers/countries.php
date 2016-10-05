<?php 

class Countries extends CI_Controller{

	public function __construct(){

    	parent::__construct();

		$this->load->model('country'); 
	}

	public function check(){

		if( $this->input->post() ){ //if post

			//prepare info
			$data = array();

			$data['short_name'] = $this->input->post('short_name');
			$data['long_name']  = $this->input->post('long_name');

			//get country
			$country = $this->country->check_if_exists($data);

			//echo id, if no id echo 0
			echo ( $country ) ? $country->id : 0;
		}
		else{

			echo 0;
		}
	}
}