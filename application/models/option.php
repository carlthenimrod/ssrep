<?php

class option extends CI_Model{

    function __construct(){
    	
        parent::__construct();
    }

	function get(){

		//get options
		$query = $this->db->get('options');

		if( $query->num_rows() > 0 ){

			return $query->row();
		}
		else{ //create options profile

			//get user id
			$user_id = $this->session->userdata('id');

			//insert options
			$this->db->insert('options', array( 'user_id' => '1' ));

			//get options
			$query = $this->db->get('options');

			return $query->row();
		}
	}
}