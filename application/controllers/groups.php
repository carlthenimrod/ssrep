<?php 

class Groups extends CI_Controller{

	function __construct(){

		parent::__construct();
	}

	function index($group = false){

		if( $group ){

			//get user options
			$options = $this->option->get();

			//if groups are enabled
			if( $options->groups ){

				//get group
				$group = $this->group->get($group);

				//if group found
				if( $group ){

					$data = array();

					//add group info
					$data['group_id']   = $group->id;
					$data['group_name'] = $group->name;
					$data['color'] 		= $group->color;

					$this->load->view('header');
					$this->load->view('index', $data);
					$this->load->view('footer');
				}
				else{

					$this->load->view('header');
					$this->load->view('index');
					$this->load->view('footer');
				}
			}
			else{

				$this->load->view('header');
				$this->load->view('index');
				$this->load->view('footer');
			}
		}
		else{

			redirect();
		}
	}

	function all(){

		$groups = $this->group->all();

		$data['json'] = json_encode($groups);

		$this->load->view('json/data', $data);
	}

	function save(){

		if( $this->input->post() ){

			//set rules
			$this->form_validation->set_rules('name', 'Group name', 'required|alpha|is_unique[group.name]');

			//set messages
			$this->form_validation->set_message('required', 'Error: Group Name is required.');
			$this->form_validation->set_message('is_unique', 'Error: Group Name is already being used.');
			$this->form_validation->set_message('alpha', 'Error: Group Name must only contain letters.');

			if( $this->form_validation->run() ){

				//get name
				$name = $this->input->post('name');

				//get default
				if( $this->input->post('default') == '1' ){

					$default = 1;
				}
				else{

					$default = 0;
				}

				$data = array(
					'default' => $default,
					'name' => $name
				);

				//save group
				$id = $this->group->save($data);

				$data['json'] = json_encode( array('id' => $id) );

				$this->load->view('json/data', $data);	
			}
			else{

				$data['json'] = json_encode( array('errors' => validation_errors()) );

				$this->load->view('json/data', $data);	
			}
		}
	}

	function save_name(){

		if( $this->input->post() ){

			//set rules
			$this->form_validation->set_rules('name', 'Group name', 'required|alpha|is_unique[group.name]');

				if( $this->form_validation->run() ){

				$data = array();

				$data['id'] = $this->input->post('id');
				$data['name'] = $this->input->post('name');

				if( $this->group->save($data) ){

					echo true;

					exit();
				}
			}
		}

		echo false;

		exit();
	}

	function save_default(){

		if( $this->input->post() ){

			$data = array();

			$data['id'] = $this->input->post('id');
			$data['default'] = ( (bool) $this->input->post('checked') ) ? 1 : 0;

			if( $this->group->save($data) ){

				echo true;

				exit();
			}
			else{

				echo false;

				exit();
			}
		}

		echo false;

		exit();
	}

	function delete(){

		if( $this->input->post('id') ){

			$id = $this->input->post('id');

			$this->group->delete($id);

			echo true;

			exit();
		}
	}
}