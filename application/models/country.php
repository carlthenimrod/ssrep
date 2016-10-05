<?php

class country extends CI_Model{

    function __construct(){
    	
        parent::__construct();
    }

    function all(){

		$this->db->select('*');
		$this->db->from('country');
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
		$this->db->from('country');
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

		$this->db->insert('country', $data);

		return $this->db->insert_id();
	}

	function delete($id){

		$this->db->where('id', $id);
		$this->db->delete('country');
	}
}