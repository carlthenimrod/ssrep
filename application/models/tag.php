<?php

class tag extends CI_Model{

    function __construct(){
    	
        parent::__construct();
    }

	function all(){

		//get all groups
		$query = $this->db->get('tag');

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
		$this->db->from('tag');
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

			return $this->db->update('tag', $data);
		}
		else{ //new record

			$this->db->insert('tag', $data);

			return $this->db->insert_id();
		}
	}

	function delete($id){

		//delete tag
		$this->db->where('id', $id);
		$this->db->delete('tag'); 

		//select all reps
		$this->db->select('*');
		$this->db->from('rep');

		$query = $this->db->get();

		if( $query->num_rows() > 0 ){

			$reps = $query->result();

			//for each rep
			foreach($reps as $r){

				//store existing tags
				$new_tags = array();

				//set match default
				$match = false;

				//get groups
				$tags = explode('*', $r->tags);

				//for each group
				foreach($tags as $t){

					array_push($new_tags, $t);

					//if match, we need to update rep
					if( $id == $t ) $match = true;
				}

				//if match
				if($match){

					if( count( $new_tags ) > 0 ){

						$new_tags = implode('*', $new_tags);
					}
					else{

						$new_tags = NULL;
					}

					//save rep
					$this->db->where('id', $r->id);
					$this->db->update('rep', array('tags' => $new_tags));
				}
			}
		}
	}
}