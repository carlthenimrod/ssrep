<?php

class group extends CI_Model{

    function __construct(){
    	
        parent::__construct();
    }

	function all(){

		//get all groups
		$query = $this->db->get('group');

		//if results, return object
		if( $query->num_rows() > 0 ){

			return $query->result();
		}
		else{

			return false;
		}
	}

	function get($name){

		$this->db->select('*');
		$this->db->from('group');
		$this->db->where('LOWER(name)', strtolower($name));

		$query = $this->db->get();

		if($query->num_rows() > 0){

			return $query->row();
		}
		else{

			return false;
		}
	}

	function save($data){

		if( isset($data['id']) ){ //update

			$this->db->where('id', $data['id']);

			unset($data['id']);

			return $this->db->update('group', $data);
		}
		else{ //new record

			$this->db->insert('group', $data);

			return $this->db->insert_id();
		}
	}

	function delete($id){

		//delete group
		$this->db->where('id', $id);
		$this->db->delete('group'); 

		//select all reps
		$this->db->select('*');
		$this->db->from('rep');

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			$reps = $query->result();

			//for each rep
			foreach($reps as $r){

				//store existing groups
				$new_groups = array();

				//set match default
				$match = false;

				//get groups
				$groups = explode('*', $r->groups);

				//for each group
				foreach($groups as $g){

					array_push($new_groups, $g);

					//if match, we need to update rep
					if( $id == $g ) $match = true;
				}

				//if match
				if($match){

					if( count( $new_groups ) > 0 ){

						$new_groups = implode('*', $new_groups);
					}
					else{

						$new_groups = NULL;
					}

					//save rep
					$this->db->where('id', $r->id);
					$this->db->update('rep', array('groups' => $new_groups));
				}
			}
		}
	}
}