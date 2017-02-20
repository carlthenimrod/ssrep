<?php

class image extends CI_Model{

    function __construct(){
    	
        parent::__construct();
    }

	function all(){

		//get all images
		$query = $this->db->get('img');

		//if results, return object
		if( $query->num_rows() > 0 ){

			return $query->result();
		}
		else{

			return false;
		}
	}

	function get($id){

		$this->db->where('id', $id);

		$query = $this->db->get('img');

		return $query->row();
	}

	function save( $data ){

		$img = array(

			'file' => $data['file_name'],
			'size' => $data['file_size']
		);

		$this->db->insert('img', $img);

		return $this->db->insert_id();
	}

	function delete( $id ){

		//delete image
		$this->db->where('id', $id);
		$this->db->delete('img');

		$this->db->select('*');
		$this->db->from('rep');
		$this->db->where('img', $id);

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			$reps = $query->result();

			foreach($reps as &$r){

				$r->img = NULL;
			}

			$this->db->update_batch('rep', $reps, 'id');
		}
	}
}