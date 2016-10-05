<?php

class location extends CI_Model{

    function __construct(){
    	
        parent::__construct();
    }

    function all(){

		$this->db->select('*');
		$this->db->from('location');
		$this->db->order_by('long_name');

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			return $query->result();
		}
		else{

			return false;
		}

    }

	function check_if_exists($data){

		$this->db->select('id');
		$this->db->from('location');
		$this->db->where($data);

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			return $query->row();
		}
		else{

			return false;
		}
	}

	function save($data){

		$this->db->insert('location', $data);

		return $this->db->insert_id();
	}

	function delete($id){

		$this->db->where('id', $id);
		$this->db->delete('location');
	}

	function get_country_id($id){

		$this->db->select('country_id');
		$this->db->from('location');
		$this->db->where('id', $id);

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			return $query->row()->country_id;
		}
		else{

			return false;
		}
	}

	function locations_remaining($id){

		$this->db->select('id');
		$this->db->from('location');
		$this->db->where('country_id', $id);

		$query = $this->db->get();

		return $query->num_rows();
	}
}